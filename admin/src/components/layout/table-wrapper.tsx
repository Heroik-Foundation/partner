import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export function TableWrapper({ children, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("bg-white shadow-sm border rounded-xl", props.className)}
    >
      {children}
    </div>
  );
}

export function TableHeader({ children, ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex items-center space-x-2 p-5", props.className)}
    >
      {children}
    </div>
  );
}
