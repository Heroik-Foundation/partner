import { cn } from "@/lib/utils";

export const ItemNotFound = ({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-red-100 text-red-500 rounded-xl h-28",
        className
      )}
    >
      <span className="font-bold">{message || "Not Found"}</span>
    </div>
  );
};
