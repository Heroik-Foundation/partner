import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useUserEventTicketVerificationMutation } from "../../hooks/mutation";

const QrReader = ({ isScanning }: { isScanning: boolean }) => {
  const scannerRef = useRef<QrScanner | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lastScannedRef = useRef<string | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isCameraAccessible, setIsCameraAccessible] = useState(true);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const { mutate, isPending } = useUserEventTicketVerificationMutation();

  const handleScanSuccess = (result: QrScanner.ScanResult) => {
    const scannedData = result.data;

    if (lastScannedRef.current === scannedData) {
      return;
    }

    lastScannedRef.current = scannedData;
    setScannedResult(scannedData);

    mutate({ eventTicketId: scannedData });

    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
    resultTimeoutRef.current = setTimeout(() => {
      setScannedResult(null);
    }, 10000);

    if (scanTimeoutRef.current) {
      clearTimeout(scanTimeoutRef.current);
    }
    scanTimeoutRef.current = setTimeout(() => {
      lastScannedRef.current = null;
      console.log("Ready to scan again");
    }, 5000);
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
      // Clean up timeouts
      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }

      // Clean up scanner
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
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-blue-500">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          playsInline
        />
      </div>

      {!isCameraAccessible && (
        <p className="text-rose-600 text-sm font-bold text-center mt-4">
          Camera access is blocked. Please check your browser permissions.
        </p>
      )}

      {isPending && (
        <div className="absolute top-4 left-4 bg-black text-white rounded px-3 py-1 z-50 text-sm font-bold">
          Processing Result...
        </div>
      )}

      {scannedResult && !isPending && (
        <div className="absolute top-4 left-4 bg-green-600 text-white rounded px-3 py-1 z-50 text-sm font-bold">
          Scanned: {scannedResult}
        </div>
      )}
    </div>
  );
};

export default QrReader;
