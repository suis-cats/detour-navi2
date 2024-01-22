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
        <h3 className="mb-40 font-bold">
          今回は実験のため，好きなタイミングでいいので，コンビニに行くようにお願いします．
        </h3>
        <Button
          className="btn-lg btn-info"
          onClick={() => router.push("/map3")}
        >
          コンビニに行く
        </Button>
        <div className="mt-4 "> </div>
        <Button className="btn-lg btn-info" onClick={() => router.push("/end")}>
          時間がない
        </Button>
      </div>
    </div>
  );
}
