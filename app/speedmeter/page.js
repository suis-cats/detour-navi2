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

    // 平均速度を計算
    const totalSpeed = newHistory.reduce(
      (acc, record) => acc + record.speed,
      0
    );
    setAverageSpeed(totalSpeed / newHistory.length);

    // 渋滞はんてい
    //過去に30km/h以上になったことがある
    setIsOver30kmh(newHistory.some((record) => record.speed >= 30 / 3.6));
    //過去に5km/h以上になったことがある
    setIsOver5kmh(newHistory.some((record) => record.speed >= 5 / 3.6));

    //過去に5km/h以上になったことがあるかつ，平均速度が5km/h以下になった時
    setIsCongestionDetected(
      newHistory.some((record) => record.speed >= 5 / 3.6) &&
        totalSpeed / newHistory.length <= 5 / 3.6
    );
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
      <h1>そのまま運転し続けてください</h1>
      <h1>運転を続けてください</h1>
      <div>
        <Button
          type="button"
          className="btn btn-danger"
          onClick={() => router.push("/end")}
        >
          運転終了
        </Button>
      </div>
      <h1>
        現在の速度: {speed ? `${speed.toFixed(2)} m/s` : "0 m/s"}
        {"　"}
        {speed ? `${speed.toFixed(2) * 3.6} km/h` : "0 km/h"}
      </h1>

      <div>
        現在の座標:{" "}
        {`緯度: ${position.latitude.toFixed(
          5
        )}, 経度: ${position.longitude.toFixed(5)}`}{" "}
        <br />
        高度: {position.altitude?.toFixed(2) ?? "N/A"} m, 方角:{" "}
        {position.heading?.toFixed(2) ?? "N/A"}°, 精度:{" "}
        {position.accuracy.toFixed(2)} m, <br />
        高度の精度: {position.altitudeAccuracy?.toFixed(2) ?? "N/A"} m
      </div>
      <Button className="btn-success" onClick={downloadCSV}>
        CSVとして保存
      </Button>
      <div>
        <h2>
          3分間の平均速度:{" "}
          {averageSpeed ? `${(averageSpeed * 3.6).toFixed(2)} km/h` : "計測中"}
        </h2>
        <p>3分間平均速度30km/h以下</p>
        {averageSpeed <= 30 / 3.6 && <h2>YES</h2>}
        <p>速度5km/h以上</p>
        {isOver5kmh && <h2>YES</h2>}
        <p>渋滞！！</p>
        {isCongestionDetected && <h2>YES</h2>}
        <h>速度ログ</h>
        <ul>
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
        </ul>

        <Button
          className="btn btn-info mb-20"
          onClick={() => setIsCongestionDetected(true)}
        >
          混雑検知テスト用
        </Button>
      </div>
    </div>
  );
}
