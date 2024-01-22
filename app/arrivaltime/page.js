import Image from "next/image";
import { Button } from "react-bootstrap";

export default function Arrivaltime() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <p className="text-3vh">到着時間表示ページ</p>
        <p className="text-3vh">運転を続けてください</p>
        <p className="text-3vh mt-28">通常</p>
        <p className="text-5vh">9:30</p>
        <p className="text-3vh">現在の到着予想時間</p>
        <p className="text-5vh">9:50</p>

        <div className="mt-28">
          <Button type="button" className="btn btn-info">
            目的地変更
          </Button>
        </div>
      </div>
    </div>
  );
}
