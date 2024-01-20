import Image from "next/image";
import { Button } from "react-bootstrap";

export default function Suggest() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <h1>寄り道しませんか？</h1>

        <div className="mb-3 mt-20">
          <Button type="button" className="btn-secondary">
            近くのコンビニに寄り道
          </Button>
        </div>
        <div>
          <Button type="button" className="btn">
            寄り道しない
          </Button>
        </div>
      </div>
    </div>
  );
}
