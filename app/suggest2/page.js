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
        <h1 className="mb-20">ありがとうございます</h1>
        <h3 className="mb-4">
          今からは，実験のためコンビニに行くようにお願いします．
        </h3>
        <Button onClick={() => router.push("/map3")}>コンビニに行く</Button>
        <div className="mt-4"> </div>
        <Button onClick={() => router.push("/end")}>時間がない</Button>
      </div>
    </div>
  );
}
