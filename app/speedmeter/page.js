"use client";

import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

import { useRouter } from "next/navigation";

export default function Speedometer() {
  const router = useRouter();

  // スピードメーター
  const [speed, setSpeed] = useState(0);
  const [speedLog, setSpeedLog] = useState([]);

  // 位置情報
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    accuracy: 0,
    altitudeAccuracy: 0,
    heading: 0,
  });

  // 渋滞検知

  const [isOver5kmh, setIsOver5kmh] = useState(false);
  const [isOver30kmh, setIsOver30kmh] = useState(false);
  const [isCongestionDetected, setIsCongestionDetected] = useState(false);

  const [isCongestion, setIsCongestion] = useState(false);
  const [sumSpeed, setSumSpeed] = useState(0);

  const [speedHistory, setSpeedHistory] = useState([]);
  const [averageSpeed, setAverageSpeed] = useState(0);
  const [timer3, setTimer3] = useState(false);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const {
          latitude,
          longitude,
          altitude,
          accuracy,
          altitudeAccuracy,
          heading,
          speed,
        } = position.coords;
        const currentTime = new Date().toLocaleTimeString();
        setSpeed(speed);
        setPosition({
          latitude,
          longitude,
          altitude,
          accuracy,
          altitudeAccuracy,
          heading,
        });
        console.log(speed);
        setSpeedLog((oldLog) => [
          ...oldLog,
          {
            time: currentTime,
            speed,
            latitude,
            longitude,
            altitude,
            accuracy,
            altitudeAccuracy,
            heading,
          }, // 新しいログを配列の最後に追加
        ]);
      },

      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 速度が変わるたびに履歴を更新
  useEffect(() => {
    const now = new Date();
    const newHistory = speedHistory.filter(
      (record) => now - record.time < 180000
    ); // 3分より古い記録を削除
    newHistory.push({ speed, time: now });
    console.log(speed);
    setSpeedHistory(newHistory);

    // 最初の30km/h超えの記録を見つける
    const firstOver30Record = newHistory.find(
      (record) => record.speed >= 30 / 3.6
    );

    // 特定の時間以降の記録をフィルタリング
    const filteredHistory = firstOver30Record
      ? newHistory.filter((record) => record.time >= firstOver30Record.time)
      : [];

    let timer = null;

    if (firstOver30Record && !timer3) {
      // 3分後に実行されるアクション
      const actionAfter3Minutes = () => {
        console.log("3分が経過しました");
        // ここに実行したい処理を記述
        setTimer3(true);
      };

      // 3分間のタイマーを設定 (3分 = 180000ミリ秒)
      timer = setTimeout(actionAfter3Minutes, 180000);
    }

    // 条件に基づく平均速度の計算
    if (filteredHistory.length > 0 && timer3) {
      const totalSpeed = filteredHistory.reduce(
        (acc, record) => acc + record.speed,
        0
      );
      const currentAverageSpeed = totalSpeed / filteredHistory.length;
      setAverageSpeed(currentAverageSpeed);

      // 平均速度が30km/h以下の場合、交通渋滞と判断
      if (currentAverageSpeed <= 30 / 3.6) {
        setIsCongestionDetected(true);
      }

      // 渋滞判定
      // 過去に30km/h以上になったことがあり、現在の平均速度が30km/h以下で、最新の記録が3分以上前の場合
      const hasBeenOver5kmh = newHistory.some(
        (record) => record.speed >= 30 / 3.6
      );
      const isAverageSpeedBelow5kmh =
        totalSpeed / newHistory.length <= 30 / 3.6;
      const isMoreThan3Minutes = now - newHistory[0].time >= 180000;
    }

    // 渋滞はんてい
    //過去に30km/h以上になったことがある
    setIsOver30kmh(newHistory.some((record) => record.speed >= 30 / 3.6));
    //過去に5km/h以上になったことがある
    setIsOver5kmh(newHistory.some((record) => record.speed >= 5 / 3.6));
  }, [speed]);

  const downloadCSV = () => {
    const csvRows = [
      [
        "time",
        "speed(m/s)",
        "latitude",
        "longitude",
        "elevation(m)",
        "Acc(m)",
        "eleAcc(m)",
        "course(°)",
      ],
      ...speedLog.map((log) => [
        log.time,
        log.speed?.toFixed(2) ?? "0",
        log.latitude.toFixed(5),
        log.longitude.toFixed(5),
        log.altitude?.toFixed(2) ?? "N/A",
        log.accuracy.toFixed(2),
        log.altitudeAccuracy?.toFixed(2) ?? "N/A",
        log.heading?.toFixed(2) ?? "N/A",
      ]),
    ];
    const csvContent = "\uFEFF" + csvRows.map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "speed_log.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (isCongestionDetected) {
      downloadCSV;
      router.push("/suggest");
    }
  }, [isCongestionDetected, router]);

  return (
    <div>
      <p className="text-center mb-8" style={{ fontSize: "10vw" }}>
        寄り道提案システム
      </p>
      <p className="mb-8" style={{ fontSize: "7vw" }}>
        そのまま運転を続けてください
      </p>

      <p className="mb-8" style={{ fontSize: "7vw" }}>
        自動でおすすめの寄り道場所を提案します
      </p>
      <div>
        {/* <Button
          type="button"
          className="btn btn-info mb-4"
          onClick={() => router.push("/end")}
        >
          運転終了
        </Button> */}
      </div>
      <p style={{ fontSize: "10vw", fontWeight: "bold" }}>
        現在の速度:
        {/* {speed ? `${speed.toFixed(2)} m/s` : "0 m/s"} */}
        {"　"}
        {speed ? `${speed.toFixed(2) * 3.6} km/h` : "0 km/h"}
      </p>

      {/* <div>
        現在の座標:{" "}
        {`緯度: ${position.latitude.toFixed(
          5
        )}, 経度: ${position.longitude.toFixed(5)}`}{" "}
        <br />
        高度: {position.altitude?.toFixed(2) ?? "N/A"} m, 方角:{" "}
        {position.heading?.toFixed(2) ?? "N/A"}°, 精度:{" "}
        {position.accuracy.toFixed(2)} m, <br />
        高度の精度: {position.altitudeAccuracy?.toFixed(2) ?? "N/A"} m
      </div> */}

      <div>
        <p style={{ fontSize: "5vw" }}>3分間の平均速度（30km~計測開始）: </p>
        <p style={{ fontSize: "10vw", fontWeight: "bold" }}>
          {averageSpeed ? (
            `${(averageSpeed * 3.6).toFixed(2)} km/h`
          ) : (
            <p className="mb-40">"計測中"</p>
          )}
        </p>

        <Button
          className="btn btn-info mb-4"
          onClick={() => setIsCongestionDetected(true)}
        >
          提案テスト用
        </Button>
        {/* <p>3分間平均速度30km/h以下</p>
        {averageSpeed <= 30 / 3.6 ? <h2>YES</h2> : <h2>NO</h2>}

        <p>速度5km/h以上</p>
        {isOver5kmh ? <h2>YES</h2> : <h2>NO</h2>}
        <p>渋滞！！</p>
        {isCongestionDetected ? <h2>YES</h2> : <h2>NO</h2>}
        <h>速度ログ</h> */}
        <Button className="btn-info mb-4" onClick={downloadCSV}>
          CSVとして保存
        </Button>

        {/* <ul>
          {speedLog
            .slice()
            .reverse()
            .map(
              (
                log,
                index // 配列を反転して表示
              ) => (
                <li key={index}>
                  {log.time} - {log.speed?.toFixed(2) * 3.6 ?? "0"} km/h -
                  course(°): {log.heading?.toFixed(2) ?? "N/A"}°
                </li>
              )
            )}
        </ul> */}
      </div>
    </div>
  );
}
