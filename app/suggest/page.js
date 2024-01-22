"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const usePageTransitionSound = () => {
  const router = useRouter();

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    const handleRouteChange = () => {
      const audio = new Audio("/notification2.mp3");
      audio.play();
    };

    // 現在のパスが変わった時に音声を再生する
    handleRouteChange();

    return () => {
      // ここでは何もしなくても良い
    };
  }, [router.asPath]); // router.asPathが変わった時に効果が実行される
};

export default function Suggest() {
  usePageTransitionSound();
  const router = useRouter();

  //現在時刻あ
  const now = new Date();
  const hour = now.getHours();
  const minutes = now.getMinutes();

  return (
    <div
      className="d-flex justify-content-center "
      style={{ height: "100vh", backgroundColor: "#feffdf" }}
    >
      <div>
        <p>
          {hour}:{minutes}
        </p>
        <p className="mt-5 mb-5 font-bold h1 text-center text-top">
          寄り道提案システム
        </p>

        <p className="mt-20 font-bold text-large" style={{ fontSize: "7vw" }}>
          現在，道が混んでいます．
        </p>

        <p className="mb-16" style={{ fontSize: "7vw", fontWeight: "bolder" }}>
          コンビニで休憩しませんか？
        </p>

        <p style={{ margin: "0vw", color: "red" }}>時刻記録のため</p>
        <p style={{ fontSize: "7vw", margin: "0vw", color: "orange" }}>
          この画面の
        </p>
        <p style={{ fontSize: "7vw", margin: "0vw", color: "orange" }}>
          スクショをお願いします
        </p>

        <div className="mb-10 mt-10">
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
