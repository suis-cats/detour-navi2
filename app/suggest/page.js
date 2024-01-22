"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Suggest() {
  const router = useRouter();

  //現在時刻
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  return (
    <div className="d-flex justify-content-center " style={{ height: "100vh" }}>
      <div>
        <p className="mt-5 mb-5 font-bold h1 text-center text-top">
          寄り道提案システム
        </p>

        <p className="mt-20 font-bold text-large" style={{ fontSize: "7vw" }}>
          現在，道が混んでいます．
        </p>

        <p className="mb-32" style={{ fontSize: "7vw", fontWeight: "bolder" }}>
          コンビニで休憩しませんか？
        </p>

        <p style={{ margin: "0vw" }}>時刻記録のため</p>
        <p style={{ fontSize: "7vw", margin: "0vw" }}>この画面の</p>
        <p style={{ fontSize: "7vw", margin: "0vw" }}>スクショをお願いします</p>

        <div className="mb-20 mt-10">
          <Button
            type="button"
            className="btn btn-info btn-lg"
            onClick={() => router.push("/map3")}
          >
            休憩する 近くのコンビニを検索(GoogleMap)
          </Button>
        </div>
        <div>
          <Button
            type="button"
            className="btn-info mb-60 btn-lg"
            onClick={() => router.push("/suggest2")}
          >
            寄りたくない
          </Button>
        </div>
      </div>
    </div>
  );
}
