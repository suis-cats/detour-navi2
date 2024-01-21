"use client";
import React, { useEffect, useRef, useState } from "react";

const GoogleMapConvenienceStores = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [convenienceStores, setConvenienceStores] = useState([]); // コンビニのリストを管理する状態
  const [markers, setMarkers] = useState([]);

  // Google Maps APIをロードする
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          initMap(position.coords.latitude, position.coords.longitude);
          updateLocation(); // 位置情報を初期化後に更新
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  // Google Mapを初期化する関数
  const initMap = (lat, lng) => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 15,
    });
    setMap(map);

    // コンビニを検索する
    searchNearbyConvenienceStores(map, lat, lng);
  };

  // 近くのコンビニを検索してマップに表示する関数
  const searchNearbyConvenienceStores = (map, lat, lng) => {
    const service = new window.google.maps.places.PlacesService(map);
    const location = new window.google.maps.LatLng(lat, lng);

    service.nearbySearch(
      {
        location,
        radius: 5000, // 5000メートル以内のコンビニを検索
        type: ["convenience_store"],
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setConvenienceStores(results); // コンビニのリストを設定
          const convenienceStoreMarkers = results.map((store) => ({
            lat: store.geometry.location.lat(),
            lng: store.geometry.location.lng(),
          }));
          setMarkers(convenienceStoreMarkers); // コンビニの座標を設定
        }
      }
    );

    // マップの中心を新しい位置に設定
    map.setCenter(location);
  };

  // マーカーを作成する関数
  markers.forEach((markerInfo) => {
    const infoWindow = new google.maps.InfoWindow();
    const marker = new google.maps.Marker({
      position: markerInfo,
      map,
    });

    // マーカークリック時のイベントハンドラー
    google.maps.event.addListener(marker, "click", function () {
      const contentString = `
      <div>
          Google Mapに遷移します．
        <button type="button" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${markerInfo.lat},${markerInfo.lng}', '_blank')">行く</button>
      </div>
      `;
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });
  });

  return (
    <div>
      <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
      <ul>
        {convenienceStores.map((store, index) => (
          <li key={index}>{store.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleMapConvenienceStores;
