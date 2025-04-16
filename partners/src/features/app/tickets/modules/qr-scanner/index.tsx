"use client";

import { Button } from "@/modules/ui/button";
import { useState } from "react";
import { QRCodeIcon } from "../icons";
import QrReader from "./qr-reader";
import { useRouter } from "@tanstack/react-router";
import { XCircle } from "lucide-react";

export function QRCodeScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const { navigate } = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-10">
      <Button
        className="text-primary rounded-full bg-white font-bold hover:bg-white"
        onClick={() => setIsScanning((prev) => !prev)}
      >
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </Button>

      <div className="w-full flex flex-col items-center justify-center">
        {isScanning ? <QrReader isScanning={isScanning} /> : <QRCodeIcon />}
      </div>

      <Button
        className="rounded-full"
        onClick={() => {
          navigate({
            to: "/app",
          });
        }}
        variant="destructive"
      >
        <span className="text-base text-semibold">Close</span>
        <XCircle className="fill-white stroke-rose-500" size={24} />
      </Button>
    </div>
  );
}
