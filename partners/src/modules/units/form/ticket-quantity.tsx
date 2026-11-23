import { useState, useRef, useEffect } from "react";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeNumericInput } from "@/helpers/input";
import { Label } from "@/modules/ui/label";

export interface TicketQuantitySelectProps {
  value: number; // 0 for unlimited, > 0 for set number (or 0 if user explicitly typed 0 in limited mode)
  onChange: (value: number, quantityType?: "unlimited" | "limited") => void;
  quantityType?: "unlimited" | "limited";
  hasError?: boolean;
  id?: string;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export function TicketQuantitySelect({
  value,
  onChange,
  quantityType,
  hasError = false,
  id = "ticket-quantity-input",
  disabled = false,
  label = "Ticket Quantity",
  helperText,
  defaultExpanded = true,
  className,
}: TicketQuantitySelectProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const initialMode =
    quantityType
      ? quantityType
      : Number(value ?? 0) === 0
        ? "unlimited"
        : "limited";

  const [mode, setMode] = useState<"unlimited" | "limited">(initialMode);
  const [rawInputValue, setRawInputValue] = useState<string>(() =>
    initialMode === "limited" ? String(value ?? 1) : "",
  );

  // Track the last non-zero number so switching back to "Set number" remembers it
  const lastNonZeroCount = useRef<number>(value > 0 ? value : 250);

  useEffect(() => {
    if (quantityType) {
      setMode(quantityType);
      if (quantityType === "limited") {
        setRawInputValue(String(value ?? 0));
        if (value > 0) lastNonZeroCount.current = value;
      } else {
        setRawInputValue("");
      }
      return;
    }

    if (value > 0) {
      lastNonZeroCount.current = value;
      setRawInputValue(String(value));
    }
  }, [value, quantityType]);

  const isUnlimited = mode === "unlimited";

  const handleSelectUnlimited = () => {
    if (disabled) return;
    setMode("unlimited");
    setRawInputValue("");
    onChange(0, "unlimited");
  };

  const handleSelectSetNumber = () => {
    if (disabled) return;
    setMode("limited");
    const val = lastNonZeroCount.current || 250;
    setRawInputValue(String(val));
    onChange(val, "limited");
  };

  const handleQuantityInput = (rawValue: string) => {
    const cleaned = sanitizeNumericInput(rawValue);
    setRawInputValue(cleaned);
    const num = cleaned === "" ? 0 : Number(cleaned);
    if (num > 0) {
      lastNonZeroCount.current = num;
    }
    onChange(num, "limited");
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
              : `Set number (${rawInputValue !== "" ? rawInputValue : value} tickets)`}
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
                    disabled={disabled || Number(rawInputValue || value) <= 0}
                    onClick={() => {
                      const current = Number(rawInputValue || value || 0);
                      const nextVal = Math.max(0, current - 1);
                      setRawInputValue(String(nextVal));
                      if (nextVal > 0) lastNonZeroCount.current = nextVal;
                      onChange(nextVal, "limited");
                    }}
                    className="w-11 h-11 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-zinc-800 hover:bg-zinc-50 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Minus size={16} strokeWidth={2.5} />
                  </button>

                  <input
                    id={id}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    disabled={disabled}
                    value={rawInputValue}
                    placeholder="0"
                    onChange={(e) => handleQuantityInput(e.target.value)}
                    className={cn(
                      "w-24 h-11 rounded-xl bg-white border shadow-xs text-center font-bold text-zinc-900 text-lg focus:outline-hidden transition-all",
                      hasError
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                        : "border-zinc-200 focus:border-primary focus:ring-2 focus:ring-primary/20",
                    )}
                  />

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const current = Number(rawInputValue || value || 0);
                      const nextVal = current + 1;
                      setRawInputValue(String(nextVal));
                      lastNonZeroCount.current = nextVal;
                      onChange(nextVal, "limited");
                    }}
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
