"use client";
import Image from "next/image";
import { Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Suggest() {
  const router = useRouter();

  useEffect(() => {
    router.push("/speedmeter");
  }, []);

  return <div>Loading...</div>;
}
