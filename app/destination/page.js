import Image from "next/image";
import { Button } from "react-bootstrap";

export default function Destination() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div>
        <div className="mt-28">
          <Button type="button" className="btn btn-lg">
            決定
          </Button>
        </div>
      </div>
    </div>
  );
}
