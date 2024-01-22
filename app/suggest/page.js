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
        <p>提案</p>
        <p>コンビニに寄りませんか？</p>

        <div className="mb-3 mt-20">
          <Button
            type="button"
            className="btn"
            onClick={() => router.push("/map3")}
          >
            近くのコンビニを表示
          </Button>
        </div>
        <div>
          <Button type="button" className="btn-secondary">
            寄りたくない
          </Button>
        </div>
      </div>
    </div>
  );
}
