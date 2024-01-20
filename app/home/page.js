"use client";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

export default function Home() {
  const [latitude, setLatitude] = useState("???");
  const [longitude, setLongitude] = useState("???");

  useEffect(() => {
    // 位置情報取得成功時の処理
    const successCallback = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    };

    // 位置情報取得失敗時の処理
    const errorCallback = (error) => {
      alert("位置情報が取得できませんでした");
    };

    // 位置情報を取得する関数
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };

    // GPS許可をリクエストする関数
    const requestGPSPermission = async () => {
      try {
        const permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });
        if (permissionStatus.state === "granted") {
          getLocation();
        } else if (permissionStatus.state === "prompt") {
          await permissionStatus.request();
          if (permissionStatus.state === "granted") {
            getLocation();
          }
        } else {
          alert("GPSアクセスが許可されていません");
        }
      } catch (error) {
        alert("GPSアクセスのリクエストに失敗しました");
      }
    };

    // GPS許可ボタンが押された時のイベントハンドラを設定
    const gpsButton = document.getElementById("gpsButton");
    if (gpsButton) {
      gpsButton.onclick = requestGPSPermission;
    }
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <h1>運転を続けてください</h1>

        <div className="mb-3 mt-20">
          <Button id="gpsButton" type="button" className="btn-secondary">
            GPSをリクエスト
          </Button>
        </div>
        <div>
          <Button type="button" className="btn">
            運転終了
          </Button>
        </div>
        <div className="mt-3">
          <p>
            緯度：<span>{latitude}</span>
            <span>度</span>
          </p>
          <p>
            経度：<span>{longitude}</span>
            <span>度</span>
          </p>
        </div>
      </div>
    </div>
  );
}
