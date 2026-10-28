import { useState, useRef, useEffect } from "react";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeNumericInput } from "@/helpers/input";
import { Label } from "@/modules/ui/label";

export interface TicketQuantitySelectProps {
  value: number; // 0 for unlimited, > 0 for set number
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function TicketQuantitySelect({
  value,
  onChange,
  disabled = false,
  label = "Ticket Quantity",
  helperText,
  defaultExpanded = true,
  className,
}: TicketQuantitySelectProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);
  const isUnlimited = Number(value ?? 0) === 0;

  // Track the last non-zero number so switching back to "Set number" remembers it
  const lastNonZeroCount = useRef<number>(value > 0 ? value : 1);

  useEffect(() => {
    if (value > 0) {
      lastNonZeroCount.current = value;
    }
  }, [value]);

  const handleSelectUnlimited = () => {
    if (disabled) return;
    onChange(0);
  };

  const handleSelectSetNumber = () => {
    if (disabled) return;
    if (isUnlimited) {
      onChange(lastNonZeroCount.current || 250);
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <Label className="text-base font-bold">{label}</Label>}

      {/* Trigger Box matching Image 2 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full py-4 px-4 rounded-xl border border-primary/50 bg-white gap-4 flex items-center justify-between text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm font-medium text-zinc-600">
          {isOpen
            ? "Choose how many tickets can be sold for this event"
            : isUnlimited
              ? "Unlimited"
              : `Set number (${value} tickets)`}
        </span>
        <ChevronDown
          size={18}
          className={cn(
            "text-zinc-500 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {helperText && (
        <p className="text-xs text-primary/70 italic">{helperText}</p>
      )}

      {/* Options Cards matching Image 1 */}
      {isOpen && (
        <div className="space-y-3 pt-1">
          {/* Card 1: Unlimited */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleSelectUnlimited}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectUnlimited();
              }
            }}
            className={cn(
              "w-full rounded-2xl p-4 transition-all flex items-start cursor-pointer select-none",
              isUnlimited
                ? "border-2 border-primary bg-primary/[0.03] shadow-xs"
                : "border border-zinc-200 bg-white hover:border-zinc-300",
              disabled && "opacity-60 cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                isUnlimited ? "border-primary" : "border-zinc-400",
              )}
            >
              {isUnlimited && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div className="flex flex-col ml-3.5 space-y-1">
              <span className="font-bold text-base text-zinc-900 leading-tight">
                Unlimited
              </span>
              <span className="text-xs text-zinc-500 font-normal leading-normal">
                Sell as many tickets as people want to buy. No cap.
              </span>
            </div>
          </div>

          {/* Card 2: Set number */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleSelectSetNumber}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectSetNumber();
              }
            }}
            className={cn(
              "w-full rounded-2xl p-4 transition-all flex items-start cursor-pointer select-none",
              !isUnlimited
                ? "border-2 border-primary bg-primary/[0.03] shadow-xs"
                : "border border-zinc-200 bg-white hover:border-zinc-300",
              disabled && "opacity-60 cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                !isUnlimited ? "border-primary" : "border-zinc-400",
              )}
            >
              {!isUnlimited && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div className="flex flex-col ml-3.5 space-y-1 w-full">
              <span className="font-bold text-base text-zinc-900 leading-tight">
                Set number
              </span>
              <span className="text-xs text-zinc-500 font-normal leading-normal">
                Stop sales automatically once the limit is reached.
              </span>

              {/* Stepper Control when "Set number" is active */}
              {!isUnlimited && (
                <div
                  className="mt-3 flex items-center gap-2 pt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={disabled || value <= 1}
                    onClick={() => onChange(Math.max(1, value - 1))}
                    className="w-11 h-11 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-800 hover:bg-zinc-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={disabled}
                    value={value > 0 ? value : ""}
                    placeholder="1"
                    onChange={(e) => {
                      const cleaned = sanitizeNumericInput(e.target.value);
                      const val = Number(cleaned);
                      onChange(val <= 0 ? 1 : val);
                    }}
                    className="w-24 h-11 rounded-xl bg-white border border-zinc-200 shadow-xs text-center font-bold text-zinc-900 text-lg focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(Math.max(1, (value || 0) + 1))}
                    className="w-11 h-11 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-800 hover:bg-zinc-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </button>

                  <span className="text-sm font-medium text-zinc-500 ml-2 select-none">
                    tickets
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketQuantitySelect;
