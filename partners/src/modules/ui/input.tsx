import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null);

    React.useImperativeHandle(ref, () => innerRef.current!);

    const onWheel = React.useCallback(
      (e: React.WheelEvent<HTMLInputElement>) => {
        if (type !== "number") return;

        const el = e.currentTarget;
        el.blur();
        requestAnimationFrame(() => el.focus());
      },
      [type],
    );

    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl border-2 border-primary/15 bg-white px-3 py-2 text-base ring-primary font-semibold file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-primary placeholder:text-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={innerRef}
        onWheel={onWheel}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
