"use client";

import React, { useState, useEffect } from "react";

export default function Speedometer() {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setSpeed(position.coords.speed);
      },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
      <h1>現在の速度: {speed ? `${speed.toFixed(2)} m/s` : "データなし"}</h1>
    </div>
  );
}
