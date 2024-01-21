"use client";

import { Wrapper } from "@googlemaps/react-wrapper";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

// const getNearbyConvenienceStores = async (latitude, longitude) => {
//   const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Google APIキーを設定
//   const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=convenience_store&key=${apiKey}`;

//   try {
//     // Corsの回避のためにaxiosを使用
//     const response = await axios.get(url, {
//       headers: {
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Methods": "GET",
//         "Access-Control-Allow-Headers": "Content-Type",
//       },
//     });

//     return response.data.results;
//   } catch (error) {
//     console.error("Error fetching nearby convenience stores: ", error);
//     return [];
//   }
// };

const initTrafficLayer = (map) => {
  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);
};

const MyMapComponent = ({ center, zoom }) => {
  // 現在地の緯度と経度を保存するための状態
  const [currentLocation, setCurrentLocation] = useState({
    lat: null,
    lng: null,
  });
  const [shops, setShops] = useState([]);
  const [map2, setMap] = useState(null);
  const [posts, setPosts] = useState([]);

  const adjustMap = function (mode, amount) {
    const map = new google.maps.Map(ref.current, {
      center,
      zoom,
    });
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

  const ref = useRef();

  //   useEffect(() => {
  //     getNearbyConvenienceStores(35.6895, 139.6917).then((convenienceStores) => {
  //       console.log(convenienceStores); // 近くのコンビニのリストが出力される
  //     });
  //   }, []);

  const markers = [
    { lat: 36.694906165607364, lng: 137.2135642244631 },
    // 他の座標も追加できます
    { lat: 36.69001961728219, lng: 137.21590302165652 },
    { lat: 36.70381470277856, lng: 137.1879253668227 },
    // さらに他の座標も追加できます
  ];

  useEffect(() => {
    const map = new google.maps.Map(ref.current, {
      center,
      zoom,
      heading: 390,
      tilt: 47.5,
    });

    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();

      markers.forEach((markerInfo) => {
        const marker = new google.maps.Marker({
          position: markerInfo,
          map,
        });

        bounds.extend(marker.getPosition());
      });

      // マーカーが存在する場合、境界ボックスをもとにズーム レベルを自動調整
      map.fitBounds(bounds);
    }

    // 渋滞情報を追加
    initTrafficLayer(map);

    const infoWindow = new google.maps.InfoWindow();

    markers.forEach((markerInfo) => {
      const marker = new google.maps.Marker({
        position: markerInfo,
        map,
      });

      google.maps.event.addListener(marker, "click", function () {
        const contentString = `
        <div>
            Google Mapに遷移します．
          <Button type="button" class="btn btn-primary" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${markerInfo.lat},${markerInfo.lng}', '_blank')">行く</Button>
        </div>
      `;

        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
      });
    });
  }, [center, zoom, markers]);

  useEffect(() => {
    // ユーザーの位置情報を取得
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCurrentLocation(currentLoc);

          // 現在地が取得できたら、すぐに店舗リストを取得

          console.log("map", map);
          const service = new google.maps.places.PlacesService(map);
          service.nearbySearch(
            {
              location: currentLoc,
              radius: 1000,
              type: "store",
            },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setShops(results);
              }
            }
          );
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []); // mapを依存配列に加える

  return (
    <div>
      <div ref={ref} style={{ width: "90vw", height: "70vh" }} />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
      GPSの表示
      <div>
        <p>lat{currentLocation.lat}</p>
        <p>lng{currentLocation.lng}</p>
      </div>
      {shops.length > 0 && (
        <div className="mx-5 mb-5">
          <h2 className="underline text-lg mb-3">Nearby Stores</h2>
          <ul className="list-disc list-inside">
            {shops.map((shop, index) => (
              <li key={index}>{shop.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const render = (status) => {
    return <h1>{status}</h1>;
  };

  return (
    <div>
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} // 環境変数の正しい使い方
        render={render}
      >
        <MyMapComponent center={{ lat: -34.397, lng: 150.644 }} zoom={8} />
      </Wrapper>
    </div>
  );
};

export default App;
