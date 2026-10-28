import * as React from "react";
import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/ui/popover";

export interface TimePickerProps {
  value?: string; // "HH:mm" (24-hour format e.g. "14:30")
  onChange?: (time: string) => void;
  placeholder?: string;
  minTime?: string; // "HH:mm"
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  showPresets?: boolean;
}

// Convert "HH:mm" to 12-hour object
export function parseTimeTo12Hour(timeStr?: string): {
  hour12: number;
  minute: number;
  period: "AM" | "PM";
} {
  if (!timeStr || !/^\d{1,2}:\d{2}$/.test(timeStr)) {
    return { hour12: 12, minute: 0, period: "AM" };
  }

  const [hStr, mStr] = timeStr.split(":");
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);

  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;

  return { hour12, minute: m, period };
}

// Convert 12-hour pieces back to "HH:mm" (24-hour format)
export function formatTo24Hour(
  hour12: number,
  minute: number,
  period: "AM" | "PM",
): string {
  let h = hour12 % 12;
  if (period === "PM") {
    h += 12;
  }
  const hStr = String(h).padStart(2, "0");
  const mStr = String(minute).padStart(2, "0");
  return `${hStr}:${mStr}`;
}

// Format "HH:mm" to display string e.g. "2:30 PM"
export function formatDisplayTime(timeStr?: string): string {
  if (!timeStr) return "";
  const { hour12, minute, period } = parseTimeTo12Hour(timeStr);
  const mStr = String(minute).padStart(2, "0");
  return `${hour12}:${mStr} ${period}`;
}

const COMMON_HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const ALL_MINUTES_5MIN = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

const QUICK_PRESETS = [
  { label: "9:00 AM", time: "09:00" },
  { label: "12:00 PM", time: "12:00" },
  { label: "2:00 PM", time: "14:00" },
  { label: "5:00 PM", time: "17:00" },
  { label: "7:00 PM", time: "19:00" },
  { label: "8:00 PM", time: "20:00" },
];

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "Select time",
  minTime,
  disabled = false,
  className,
  id,
  name,
  required = false,
  showPresets = true,
}) => {
  const [open, setOpen] = React.useState(false);

  const { hour12, minute, period } = React.useMemo(
    () => parseTimeTo12Hour(value),
    [value],
  );

  const handleUpdate = (
    newHour: number,
    newMinute: number,
    newPeriod: "AM" | "PM",
  ) => {
    const formatted = formatTo24Hour(newHour, newMinute, newPeriod);
    onChange?.(formatted);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  const isTimeDisabled = (time24: string): boolean => {
    if (!minTime) return false;
    return time24 < minTime;
  };

  return (
    <div className={cn("relative w-full", className)}>
      {required && (
        <input
          tabIndex={-1}
          required={required}
          value={value || ""}
          onChange={() => {}}
          className="absolute inset-0 opacity-0 pointer-events-none"
          id={id}
          name={name}
        />
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-14 w-full items-center justify-between rounded-xl border-2 border-primary/15 bg-white px-3.5 py-2 text-left text-sm font-semibold text-primary transition-all hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              !value && "text-primary/50",
              open && "border-primary ring-2 ring-primary/20",
            )}
          >
            <div className="flex items-center gap-2.5 truncate">
              <Clock className="h-5 w-5 shrink-0 text-primary/60" />
              <span className="truncate">
                {value ? formatDisplayTime(value) : placeholder}
              </span>
            </div>
            {value && !disabled ? (
              <div
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="rounded-full p-1 text-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
                title="Clear time"
              >
                <X className="h-4 w-4" />
              </div>
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[300px] rounded-2xl border border-primary/15 bg-white p-4 shadow-xl"
        >
          {/* Presets */}
          {showPresets && (
            <div className="mb-3 flex flex-wrap gap-1.5 border-b border-primary/10 pb-3">
              {QUICK_PRESETS.map((preset) => {
                const isSelected = value === preset.time;
                const isDisabled = isTimeDisabled(preset.time);

                return (
                  <button
                    key={preset.time}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onChange?.(preset.time);
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-primary/5 text-primary hover:bg-primary/15",
                      isDisabled && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Time Picker Columns */}
          <div className="flex items-center justify-between gap-2">
            {/* Hour Column */}
            <div className="flex-1">
              <span className="block text-center text-xs font-bold text-primary/50 mb-1.5">
                Hour
              </span>
              <div className="h-44 overflow-y-auto rounded-xl border border-primary/10 p-1 space-y-1 scrollbar-thin">
                {COMMON_HOURS.map((h) => {
                  const isSelected = Boolean(value && hour12 === h);
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => handleUpdate(h, minute, period)}
                      className={cn(
                        "w-full rounded-lg py-1.5 text-center text-sm font-semibold transition-all",
                        isSelected
                          ? "bg-primary text-white font-bold shadow-sm"
                          : "text-zinc-700 hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      {String(h).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-xl font-bold text-primary/40 mt-4">:</div>

            {/* Minute Column */}
            <div className="flex-1">
              <span className="block text-center text-xs font-bold text-primary/50 mb-1.5">
                Minute
              </span>
              <div className="h-44 overflow-y-auto rounded-xl border border-primary/10 p-1 space-y-1 scrollbar-thin">
                {ALL_MINUTES_5MIN.map((m) => {
                  const isSelected = Boolean(value && minute === m);
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => handleUpdate(hour12, m, period)}
                      className={cn(
                        "w-full rounded-lg py-1.5 text-center text-sm font-semibold transition-all",
                        isSelected
                          ? "bg-primary text-white font-bold shadow-sm"
                          : "text-zinc-700 hover:bg-primary/10 hover:text-primary",
                      )}
                    >
                      {String(m).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AM/PM Toggle */}
            <div className="flex flex-col justify-center gap-2 pl-1">
              <span className="block text-center text-xs font-bold text-primary/50 mb-1.5 opacity-0">
                Period
              </span>
              <div className="flex flex-col gap-1.5 rounded-xl border border-primary/10 p-1 bg-primary/5">
                {(["AM", "PM"] as const).map((p) => {
                  const isSelected = period === p && Boolean(value);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleUpdate(hour12, minute, p)}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-xs font-bold transition-all",
                        isSelected
                          ? "bg-primary text-white shadow-sm"
                          : "text-primary/70 hover:bg-primary/10",
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Current Selection summary and Done button */}
          <div className="mt-3 flex items-center justify-between border-t border-primary/10 pt-2.5">
            <span className="text-xs font-bold text-primary">
              {value ? formatDisplayTime(value) : "No time selected"}
            </span>
            <button
              type="button"
              onClick={() => {
                if (!value) {
                  handleUpdate(hour12, minute, period);
                }
                setOpen(false);
              }}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
