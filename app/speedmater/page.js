"use client";

import React, { useState, useEffect } from "react";

export default function Speedometer() {
  const [speed, setSpeed] = useState(0);
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });
  const [speedLog, setSpeedLog] = useState([]);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newSpeed = position.coords.speed;
        const { latitude, longitude } = position.coords; //lat:緯度,lon:経度
        const currentTime = new Date().toLocaleTimeString();
        setSpeed(newSpeed);
        setPosition({ latitude, longitude });
        setSpeedLog((oldLog) => [
          { speed: newSpeed, time: currentTime, latitude, longitude },
          ...oldLog,
        ]);
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    //a

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // CSVファイルとして書き出す関数（BOM付きUTF-8）
  const downloadCSV = () => {
    const csvRows = [
      ["時間", "速度(km/h)"],
      ...speedLog.map((log) => [
        log.time,
        log.speed ? (log.speed.toFixed(2) * 60 * 60) / 1000 : "0",
        log.latitude.toFixed(5),
        log.longitude.toFixed(5),
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
        現在の速度:{" "}
        {speed ? `${(speed.toFixed(2) * 60 * 60) / 1000} km/h` : "0 km/h"}
      </h1>
      <button onClick={downloadCSV}>CSVとして保存</button>
      <div>
        <h2>速度ログ:</h2>
        <ul>
          {speedLog.map((log, index) => (
            <li key={index}>
              {log.time} -{" "}
              {log.speed
                ? `${(log.speed.toFixed(2) * 60 * 60) / 1000} km/h`
                : "0 km/h"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
