import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ElementRef } from "react";

type SwitchProps = ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>;
type SwitchRef = ElementRef<typeof SwitchPrimitives.Root>;

const Switch = forwardRef<SwitchRef, SwitchProps>(
  ({ className, checked, defaultChecked, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-zinc-200",
        className,
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "group pointer-events-none flex items-center justify-center h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 dark:bg-zinc-950",
        )}
      >
        <span className="text-[8px] font-bold leading-none select-none text-zinc-400 after:content-['Off'] group-data-[state=checked]:after:content-['On']" />
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  ),
);

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
