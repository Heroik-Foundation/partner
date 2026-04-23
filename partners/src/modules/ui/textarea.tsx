import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  // Function to adjust height based on content
  const adjustHeight = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";

    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Handle input events to adjust height
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    adjustHeight(textarea);
  };

  // Handle ref to adjust height initially
  const handleRef = (node: HTMLTextAreaElement | null) => {
    if (node) {
      // Adjust height on mount
      adjustHeight(node);

      // Call the original ref if it exists
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }
  };

  // Handle key down for better performance on paste
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Adjust height when user pastes content (Ctrl+V or Cmd+V)
    if ((e.ctrlKey || e.metaKey) && e.key === "v") {
      setTimeout(() => {
        adjustHeight(e.currentTarget);
      }, 0);
    }
  };

  return (
    <textarea
      ref={handleRef}
      className={cn(
        "flex min-h-[80px] w-full rounded-xl border-2 font-semibold border-primary/15 bg-white px-3 py-2 text-base ring-primary placeholder:text-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm overflow-hidden resize-none",
        className,
      )}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
