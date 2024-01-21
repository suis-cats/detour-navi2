"use client";

import React, { useRef, useState, useEffect } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";

const MapWithCurrentLocation = ({ apiKey }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [marker, setMarker] = useState(null);

  var customIconUrl =
    "http://earth.google.com/images/kml-icons/track-directional/track-0.png";

  // 現在地の追跡とマーカーの設定   a
  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const newPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        const newHeading = position.coords.heading;

        setCurrentPosition(newPos);
        map && map.setCenter(newPos);

        if (!marker) {
          setMarker(
            new google.maps.Marker({
              position: newPos,
              map: map,
              icon: {
                url: customIconUrl,
                // 進行方向に合わせてアイコンを回転させる
                rotation: newHeading,
              },
            })
          );
        } else {
          marker.setPosition(newPos);
          marker.setIcon({
            url: customIconUrl,
            rotation: newHeading,
          });
        }
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [map, marker]);

  // 地図の初期化
  useEffect(() => {
    if (mapRef.current && !map) {
      const initialMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 14,
      });

      setMap(initialMap);
    }
  }, [mapRef, map]);

  return <div ref={mapRef} style={{ height: "500px", width: "100%" }} />;
};

const App = () => {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <MapWithCurrentLocation />
    </Wrapper>
  );
};

export default App;
