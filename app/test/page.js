"use client";

// app/test/page.js
import { useState } from "react";

export default function SearchPage() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [stores, setStores] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/api/search?lat=${lat}&lon=${lon}`
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      setStores(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>近くのコンビニを検索</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>緯度: </label>
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>
        <div>
          <label>経度: </label>
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
        </div>
        <button type="submit">検索</button>
      </form>

      <div>
        {stores.length > 0 && (
          <ul>
            {stores.map((store, index) => (
              <li key={index}>{store.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
