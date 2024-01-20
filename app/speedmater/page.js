"use client";

import React, { useState, useEffect } from "react";

export default function Speedometer() {
  const [speed, setSpeed] = useState(0);
  const [speedLog, setSpeedLog] = useState([]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newSpeed = position.coords.speed;
        const currentTime = new Date().toLocaleTimeString();
        setSpeed(newSpeed);
        setSpeedLog((oldLog) => [
          { speed: newSpeed, time: currentTime },
          ...oldLog,
        ]);
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // CSVファイルとして書き出す関数（BOM付きUTF-8）
  const downloadCSV = () => {
    const csvRows = [
      ["時間", "速度(m/s)"],
      ...speedLog.map((log) => [
        log.time,
        log.speed ? log.speed.toFixed(2) : "データなし",
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
      <h1>現在の速度: {speed ? `${speed.toFixed(2)} m/s` : "データなし"}</h1>
      <button onClick={downloadCSV}>CSVとして保存</button>
      <div>
        <h2>速度ログ:</h2>
        <ul>
          {speedLog.map((log, index) => (
            <li key={index}>
              {log.time} -{" "}
              {log.speed ? `${log.speed.toFixed(2)} m/s` : "データなし"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
