"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Suggest() {
  const router = useRouter();
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <h1 className="mb-40 font-bold">ありがとうございます</h1>
        <p className="font-bold" style={{ fontSize: "7vw" }}>
          すみませんが
        </p>
        <p className="font-bold" style={{ fontSize: "7vw" }}>
          実験のため
        </p>
        <p className="font-bold" style={{ fontSize: "7vw" }}>
          好きなタイミングでいいので
        </p>
        <p className="font-bold mb-20" style={{ fontSize: "7vw" }}>
          コンビニに行ってください．
        </p>
        <Button
          className="btn-lg btn-info"
          onClick={() => router.push("/map3")}
        >
          コンビニ
        </Button>
        <div className="mt-4 "> </div>
        <Button className="btn-lg btn-info" onClick={() => router.push("/end")}>
          時間がない
        </Button>
      </div>
    </div>
  );
}
