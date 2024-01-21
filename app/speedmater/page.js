"use client";

import React, { useState, useEffect } from "react";

export default function Speedometer() {
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
  const [isCongestionDetected, setIsCongestionDetected] = useState(false);
  const [averageSpeed, setAverageSpeed] = useState(null);
  const [isCongestion, setIsCongestion] = useState(false);
  const [sumSpeed, setSumSpeed] = useState(0);

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

  useEffect(() => {
    const calculateAverageSpeed = () => {
      const threeMinutesAgo = new Date(Date.now() - 180000); // 3分前の時刻
      const recentSpeeds = speedLog.filter(
        (log) => new Date(log.time) >= threeMinutesAgo
      );

      if (recentSpeeds.length > 0) {
        // データが存在する場合、平均速度の計算
        const totalSpeed = recentSpeeds.reduce(
          (sum, log) => sum + log.speed,
          0
        );
        const averageSpeed = totalSpeed / recentSpeeds.length;
        setAverageSpeed(averageSpeed); // 平均速度を設定
      } else {
        // データが存在しない場合
        console.log("過去3分間のデータが存在しません。");
        setAverageSpeed(null); // 平均速度をnullに設定
      }
    };

    const interval = setInterval(calculateAverageSpeed, 10000); // 10秒ごとに更新
    return () => clearInterval(interval);
  }, [speedLog]);

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

  return (
    <div>
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
      <button onClick={downloadCSV}>CSVとして保存</button>
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
      </div>
    </div>
  );
}
