"use client";

import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useRef, useEffect } from "react";

const initTrafficLayer = (map) => {
  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
};

const MyMapComponent = ({ center, zoom }) => {
  const ref = useRef();
  let map; // 地図インスタンスを外部で宣言

  // 地図の傾きや回転を調整する関数
  const adjustMap = (mode, amount) => {
    switch (mode) {
      case "tilt":
        map.setTilt(map.getTilt() + amount);
        break;
      case "rotate":
        map.setHeading(map.getHeading() + amount);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // 地図インスタンスの初期化
    map = new google.maps.Map(ref.current, {
      center,
      zoom,
      heading: 390, // 回転の初期値
      tilt: 47.5, // 傾きの初期値
    });

    const markers = [
      { lat: 36.694906165607364, lng: 137.2135642244631 },
      // 他の座標も追加できます
    ];

    markers.forEach((markerInfo) => {
      new google.maps.Marker({
        position: markerInfo,
        map,
      });
    });

    initTrafficLayer(map);

    // 地図のコントロールとしてボタンを追加
    const buttons = [
      ["Rotate Left", "rotate", 20],
      ["Rotate Right", "rotate", -20],
      ["Tilt Down", "tilt", 20],
      ["Tilt Up", "tilt", -20],
    ];

    buttons.forEach(([text, mode, amount]) => {
      const button = document.createElement("button");
      button.textContent = text;
      button.classList.add("ui-button"); // 提供されたCSSクラスを使用
      button.addEventListener("click", () => adjustMap(mode, amount));
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(button);
    });
  }, [center, zoom]);

  return <div ref={ref} style={{ width: "800px", height: "800px" }} />;
};

const App = () => {
  const render = (status) => <h1>{status}</h1>;

  return (
    <Wrapper
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      render={render}
    >
      <MyMapComponent center={{ lat: -34.397, lng: 150.644 }} zoom={8} />
    </Wrapper>
  );
};

export default App;
