"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const QrReader = ({ isScanning }: { isScanning: boolean }) => {
  const scannerRef = useRef<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraAccessible, setIsCameraAccessible] = useState(true);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const handleScanSuccess = (result: QrScanner.ScanResult) => {
    console.log("Scan successful:", result.data);
    setScannedResult(result.data);
  };

  useEffect(() => {
    const startScanner = async () => {
      if (isScanning) {
        try {
          if (!videoRef.current) {
            console.error("Video element is missing.");
            return;
          }

          if (!scannerRef.current) {
            scannerRef.current = new QrScanner(
              videoRef.current,
              handleScanSuccess,
              {
                highlightScanRegion: true,
                highlightCodeOutline: true,
              }
            );
            console.log("QrScanner instance created.");
          }

          await scannerRef.current.start();
          console.log("QrScanner started successfully.");
          setIsCameraAccessible(true);
        } catch (error) {
          console.error("Error starting scanner:", error);
          setIsCameraAccessible(false);
        }
      } else {
        if (scannerRef.current) {
          scannerRef.current.stop();
          console.log("QrScanner stopped.");
        }
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
        scannerRef.current = null;
        console.log("QrScanner instance destroyed.");
      }
    };
  }, [isScanning]);

  useEffect(() => {
    if (!isCameraAccessible && isScanning) {
      alert(
        "Camera is blocked or not accessible. Please allow camera access in your browser and reload the page."
      );
    }
  }, [isCameraAccessible, isScanning]);

  return (
    <div className="relative flex flex-col items-center justify-center bg-white p-4 rounded-2xl shadow-md w-full max-w-sm">
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-primary">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      </div>

      {!isCameraAccessible && (
        <p className="text-red-600 text-center mt-4">
          Camera access is blocked. Please check your browser permissions.
        </p>
      )}

      {scannedResult && (
        <div className="absolute top-4 left-4 bg-black text-white text-sm rounded px-3 py-1 z-50">
          Scanned Result: {scannedResult}
        </div>
      )}
    </div>
  );
};

export default QrReader;
