"use client";

import { Button } from "@/modules/ui/button";
import { useState } from "react";
import { QRCodeIcon } from "../icons";
import QrReader from "./qr-reader";

export function QRCodeScanner() {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-5">
      <Button
        className="text-primary rounded-full bg-white font-bold hover:bg-white"
        onClick={() => setIsScanning((prev) => !prev)}
      >
        {isScanning ? "Stop Scanning" : "Start Scanning"}
      </Button>

      <div className="w-full flex flex-col items-center justify-center">
        {isScanning ? <QrReader isScanning={isScanning} /> : <QRCodeIcon />}
      </div>
    </div>
  );
}
