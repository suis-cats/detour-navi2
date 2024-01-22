"use client";
import { useState } from "react";

const Home = () => {
  const [text, setText] = useState("");
  const sendLine = async () => {
    const response = await fetch(`http://localhost:3000/api/${text}`);
    const data = await response.json();
    console.log("🚀 ~ file: index.tsx ~ line 11 ~ sendLine ~ data", data);
  };
  return (
    <div>
      <main>
        <h1>LINE message送信</h1>
        <br />
        <input type="text" onChange={(e) => setText(e.target.value)} />
        <button onClick={sendLine}>送信</button>
      </main>
    </div>
  );
};

export default Home;
