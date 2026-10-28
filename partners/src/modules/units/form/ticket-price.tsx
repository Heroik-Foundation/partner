import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sanitizeNumericInput } from "@/helpers/input";
import { Label } from "@/modules/ui/label";

export interface TicketPriceSelectProps {
  value: number | string; // 0 or "0" for free, > 0 for paid
  currencySymbol?: string;
  onChange: (value: number | string) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  defaultExpanded?: boolean;
  className?: string;
  returnType?: "number" | "string";
}

export function TicketPriceSelect({
  value,
  currencySymbol = "£",
  onChange,
  disabled = false,
  label = "Event Ticket Price",
  helperText,
  defaultExpanded = true,
  className,
  returnType = "number",
}: TicketPriceSelectProps) {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const numValue = Number(value || 0);
  const [mode, setMode] = useState<"free" | "paid">(() => (numValue > 0 ? "paid" : "free"));
  const [rawInputValue, setRawInputValue] = useState<string>(() => (numValue > 0 ? String(value) : ""));

  // Track the last paid price so switching back to "Paid" remembers it
  const lastPaidPrice = useRef<string>(numValue > 0 ? String(value) : "10");

  useEffect(() => {
    const currentNum = Number(value || 0);
    if (currentNum > 0) {
      setMode("paid");
      lastPaidPrice.current = String(value);
      setRawInputValue(String(value));
    } else if ((value === 0 || value === "0") && mode === "free") {
      setRawInputValue("");
    }
  }, [value, mode]);

  const handleSelectFree = () => {
    if (disabled) return;
    setMode("free");
    setRawInputValue("");
    onChange(returnType === "number" ? 0 : "0");
  };

  const handleSelectPaid = () => {
    if (disabled) return;
    setMode("paid");
    const initialPaid =
      lastPaidPrice.current && Number(lastPaidPrice.current) > 0
        ? lastPaidPrice.current
        : "10";
    setRawInputValue(initialPaid);
    onChange(returnType === "number" ? Number(initialPaid) : initialPaid);
  };

  const handlePriceInput = (rawValue: string) => {
    const cleaned = sanitizeNumericInput(rawValue);
    setRawInputValue(cleaned);
    if (returnType === "number") {
      onChange(cleaned === "" ? 0 : Number(cleaned));
    } else {
      onChange(cleaned);
    }
  };

  const handleBlur = () => {
    if (mode === "paid" && (!rawInputValue || Number(rawInputValue) <= 0)) {
      const fallback = lastPaidPrice.current || "10";
      setRawInputValue(fallback);
      onChange(returnType === "number" ? Number(fallback) : fallback);
    }
  };

  const isFree = mode === "free";

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <Label className="text-base font-bold">{label}</Label>}

      {/* Trigger Box matching the Design Pattern */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full py-4 px-4 rounded-xl gap-4 border border-primary/50 bg-white flex items-center justify-between text-left transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm font-medium text-zinc-600">
          {isOpen
            ? "Choose the price for this event ticket"
            : isFree
              ? "Free"
              : `Paid (${currencySymbol}${rawInputValue || numValue || 0})`}
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

      {/* Options Cards */}
      {isOpen && (
        <div className="space-y-3 pt-1">
          {/* Card 1: Free */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleSelectFree}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectFree();
              }
            }}
            className={cn(
              "w-full rounded-2xl p-4 transition-all flex items-start cursor-pointer select-none",
              isFree
                ? "border-2 border-primary bg-primary/[0.03] shadow-xs"
                : "border border-zinc-200 bg-white hover:border-zinc-300",
              disabled && "opacity-60 cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                isFree ? "border-primary" : "border-zinc-400",
              )}
            >
              {isFree && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div className="flex flex-col ml-3.5 space-y-1">
              <span className="font-bold text-base text-zinc-900 leading-tight">
                Free
              </span>
              <span className="text-xs text-zinc-500 font-normal leading-normal">
                Guest can get a ticket at no cost
              </span>
            </div>
          </div>

          {/* Card 2: Paid */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleSelectPaid}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelectPaid();
              }
            }}
            className={cn(
              "w-full rounded-2xl p-4 transition-all flex items-start cursor-pointer select-none",
              !isFree
                ? "border-2 border-primary bg-primary/[0.03] shadow-xs"
                : "border border-zinc-200 bg-white hover:border-zinc-300",
              disabled && "opacity-60 cursor-not-allowed",
            )}
          >
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                !isFree ? "border-primary" : "border-zinc-400",
              )}
            >
              {!isFree && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div className="flex flex-col ml-3.5 space-y-1 w-full">
              <span className="font-bold text-base text-zinc-900 leading-tight">
                Set price
              </span>
              <span className="text-xs text-zinc-500 font-normal leading-normal">
                Charge a fixed price for each ticket
              </span>

              {/* Price input when Paid is selected */}
              {!isFree && (
                <div
                  className="mt-3 pt-1 w-full max-w-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 font-bold text-primary text-base select-none pointer-events-none">
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      disabled={disabled}
                      value={rawInputValue}
                      placeholder="0.00"
                      onChange={(e) => handlePriceInput(e.target.value)}
                      onBlur={handleBlur}
                      className="w-full h-11 pl-9 pr-4 rounded-xl bg-white border border-zinc-200 shadow-xs font-bold text-zinc-900 text-base focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketPriceSelect;
