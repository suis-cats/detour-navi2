"use client";

import React, { useState, useEffect } from "react";

export default function Speedometer() {
  const [speed, setSpeed] = useState(0);
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    altitude: 0,
    accuracy: 0,
    altitudeAccuracy: 0,
    heading: 0,
  });
  const [speedLog, setSpeedLog] = useState([]);

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
      <h1>現在の速度: {speed ? `${speed.toFixed(2)} m/s` : "0 m/s"}</h1>
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
        <h2>速度ログ:</h2>
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
                  {log.time} - {log.speed?.toFixed(2) ?? "0"} m/s - course(°):{" "}
                  {log.heading?.toFixed(2) ?? "N/A"}°
                </li>
              )
            )}
        </ul>
      </div>
    </div>
  );
}
