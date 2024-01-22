"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";

export default function Suggest() {
  const router = useRouter();
  return (
    <div className="d-flex justify-content-center " style={{ height: "100vh" }}>
      <div>
        <p className="mt-5 font-bold h1 text-center text-top">
          寄り道提案システム
        </p>
        <p className="mt-60 font-bold text-large">現在，道が混んでいます．</p>

        <h1 className="mb-20">コンビニで休憩しませんか？</h1>

        <div className="mb-3 mt-20">
          <Button
            type="button"
            className="btn btn-info"
            onClick={() => router.push("/map3")}
          >
            近くのコンビニを表示
          </Button>
        </div>
        <div>
          <Button
            type="button"
            className="btn-info mb-60"
            onClick={() => router.push("/suggest2")}
          >
            寄りたくない
          </Button>
        </div>
      </div>
    </div>
  );
}
