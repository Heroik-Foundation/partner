import { Check } from "lucide-react";

export function UnavailableMarker() {
  return (
    <div className="p-1 rounded-full bg-blue-500/5 text-blue-500 text-[11px] font-medium w-[90px] text-center">
      <span>Unavailable</span>
    </div>
  );
}

export function SuccessMarker({ text }: { text?: string }) {
  return (
    <div className="p-1 rounded-full bg-green-500/5 text-green-500 text-[11px] font-medium w-[80px] text-center flex flex-row items-center justify-center space-x-2">
      <span>{text || "Success"}</span>
      <Check stroke="currentColor" size={10} />
    </div>
  );
}
