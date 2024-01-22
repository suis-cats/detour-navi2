"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

const GoogleMapConvenienceStores = () => {
  const router = useRouter();

  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [convenienceStores, setConvenienceStores] = useState([]); // コンビニのリストを管理する状態
  const [markers, setMarkers] = useState([]);

  const ref = useRef();

  const initTrafficLayer = (map) => {
    const trafficLayer = new window.google.maps.TrafficLayer();
    trafficLayer.setMap(map);
  };

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
      heading: 45,
    });
    setMap(map);

    var customIconUrl =
      "http://earth.google.com/images/kml-icons/track-directional/track-0.png";

    // 現在地のマーカーを追加
    const currentLocationMarker = new window.google.maps.Marker({
      position: { lat, lng },
      map: map,
      title: "現在地",
      icon: {
        url: customIconUrl,
        scaledSize: new google.maps.Size(40, 40),
      },
    });

    // コンビニを検索する
    searchNearbyConvenienceStores(map, lat, lng);

    // 渋滞情報を追加
    initTrafficLayer(map);
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
          Google Map
        <Button type="button" class="btn btn-primary" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${markerInfo.lat},${markerInfo.lng}', '_blank')">行く</Button>
      </div>
      `;
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });
  });

  return (
    <div>
      <div ref={mapRef} style={{ width: "100vw", height: "90vh" }} />
      <Button
        type="button"
        class="btn btn-outline-primary btn-lg"
        onClick={() => router.push("/speedmeter")}
        style={{
          padding: "15px 30px", // ボタンの内部余白を増やす
          fontSize: "20px", // フォントサイズを大きくする
          width: "50%", // ボタンの幅を広げる
          maxWidth: "300px", // 最大幅を設定する
        }}
        disabled
      >
        戻る
      </Button>
      <Button
        type="button"
        class="btn btn-outline-primary btn-lg"
        style={{
          padding: "15px 30px", // ボタンの内部余白を増やす
          fontSize: "20px", // フォントサイズを大きくする
          width: "50%", // ボタンの幅を広げる
          maxWidth: "300px", // 最大幅を設定する
        }}
        onClick={() => window.location.reload()}
      >
        {" "}
        再読み込み
      </Button>

      <ul>
        {convenienceStores.map((store, index) => (
          <li key={index}>{store.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleMapConvenienceStores;
