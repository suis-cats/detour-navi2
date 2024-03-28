"use client";

import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import Button from "react-bootstrap/Button";

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // 現在地情報を含むclickTimesの形式を変更
  const [clickTimes, setClickTimes] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClick = () => {
    // 位置情報を取得してclickTimesに追加
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setClickTimes([
        ...clickTimes,
        { dateTime: currentDateTime, latitude, longitude },
      ]);
    });
  };

  const exportToCSV = (event) => {
    event.stopPropagation();

    // 現在の日付と時間を取得
    const now = new Date();
    const formattedDateTime = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${String(
      now.getHours()
    ).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Date and Time, Latitude, Longitude\n";
    clickTimes.forEach(function (record) {
      const { dateTime, latitude, longitude } = record;
      csvContent += `${dateTime.toISOString()},${latitude},${longitude}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    saveAs(encodedUri, `click-times-${formattedDateTime}.csv`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        textAlign: "center",
        paddingTop: "20vh",
        minHeight: "100vh",
        backgroundColor: "#333",
        color: "#fff",
      }}
    >
      <div>
        <p style={{ fontSize: "5vw" }}>
          ストレスを感じたら、画面をタップしてください。画面のどこを押しても反応します。
        </p>
        Now : {currentDateTime.toLocaleString()}
      </div>
      <Button
        onClick={exportToCSV}
        style={{ marginTop: "20px", fontSize: "20px", padding: "10px" }}
      >
        CSV出力
      </Button>
      <div>
        {clickTimes.map((record, index) => (
          <div key={index}>{`${record.dateTime.toLocaleString()} (緯度: ${
            record.latitude
          }, 経度: ${record.longitude})`}</div>
        ))}
      </div>
    </div>
  );
}
