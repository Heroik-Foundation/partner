import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/ui/popover";

export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
  showPresets?: boolean;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Helper to format Date to YYYY-MM-DD
export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to parse YYYY-MM-DD into a local Date
export function parseISODate(dateStr: string): Date | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  const parsed = new Date(year, month - 1, day);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Format readable date e.g. "Thu, Nov 12, 2026"
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return "";
  const parsed = parseISODate(dateStr);
  if (!parsed) return dateStr;

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
  className,
  id,
  name,
  required = false,
  showPresets = true,
}) => {
  const [open, setOpen] = React.useState(false);

  const selectedDate = React.useMemo(() => (value ? parseISODate(value) : null), [value]);

  // Current viewing month and year
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    return selectedDate || new Date();
  });

  // When value changes from outside, sync view if valid
  React.useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate);
    }
  }, [value]);

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    const formatted = formatDateToISO(date);
    onChange?.(formatted);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  // Calendar calculations
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = React.useMemo(() => {
    const days: { date: Date; isCurrentMonth: boolean; key: string }[] = [];

    // Prev month padding
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        date: new Date(viewYear, viewMonth - 1, day),
        isCurrentMonth: false,
        key: `prev-${day}`,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      days.push({
        date: new Date(viewYear, viewMonth, day),
        isCurrentMonth: true,
        key: `current-${day}`,
      });
    }

    // Next month padding to fill out 35 or 42 cells (6 rows)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      days.push({
        date: new Date(viewYear, viewMonth + 1, day),
        isCurrentMonth: false,
        key: `next-${day}`,
      });
    }

    return days;
  }, [viewYear, viewMonth, startingDayOfWeek, daysInCurrentMonth, daysInPrevMonth]);

  const todayStr = formatDateToISO(new Date());

  const isDateDisabled = (date: Date): boolean => {
    const dateStr = formatDateToISO(date);
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  // Quick preset dates
  const presets = React.useMemo(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const nextWeekend = new Date();
    const daysUntilSaturday = (6 - today.getDay() + 7) % 7 || 7;
    nextWeekend.setDate(today.getDate() + daysUntilSaturday);

    const inOneWeek = new Date();
    inOneWeek.setDate(today.getDate() + 7);

    return [
      { label: "Today", date: today },
      { label: "Tomorrow", date: tomorrow },
      { label: "This Weekend", date: nextWeekend },
      { label: "In 1 Week", date: inOneWeek },
    ];
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Hidden input for form submission & validation */}
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
              <CalendarIcon className="h-5 w-5 shrink-0 text-primary/60" />
              <span className="truncate">
                {value ? formatDisplayDate(value) : placeholder}
              </span>
            </div>
            {value && !disabled ? (
              <div
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="rounded-full p-1 text-primary/40 hover:bg-primary/10 hover:text-primary transition-colors"
                title="Clear date"
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
          className="w-[320px] rounded-2xl border border-primary/15 bg-white p-4 shadow-xl"
        >
          {/* Quick presets */}
          {showPresets && (
            <div className="mb-3 flex flex-wrap gap-1.5 border-b border-primary/10 pb-3">
              {presets.map((preset) => {
                const presetStr = formatDateToISO(preset.date);
                const disabledPreset = isDateDisabled(preset.date);
                const isSelected = value === presetStr;

                return (
                  <button
                    key={preset.label}
                    type="button"
                    disabled={disabledPreset}
                    onClick={() => handleSelectDate(preset.date)}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                      isSelected
                        ? "bg-primary text-white"
                        : "bg-primary/5 text-primary hover:bg-primary/15",
                      disabledPreset && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Month & Year header */}
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
              title="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1.5 font-axiforma font-bold text-primary">
              <select
                value={viewMonth}
                onChange={(e) =>
                  setViewDate(new Date(viewYear, Number(e.target.value), 1))
                }
                className="bg-transparent font-bold text-sm text-primary cursor-pointer hover:underline focus:outline-none"
              >
                {MONTHS.map((m, idx) => (
                  <option key={m} value={idx} className="text-zinc-900">
                    {m}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) =>
                  setViewDate(new Date(Number(e.target.value), viewMonth, 1))
                }
                className="bg-transparent font-bold text-sm text-primary cursor-pointer hover:underline focus:outline-none"
              >
                {Array.from(
                  { length: 15 },
                  (_, i) => new Date().getFullYear() - 1 + i,
                ).map((yr) => (
                  <option key={yr} value={yr} className="text-zinc-900">
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition-colors hover:bg-primary/10"
              title="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-primary/50 pb-1.5">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, isCurrentMonth, key }) => {
              const dateStr = formatDateToISO(date);
              const isSelected = value === dateStr;
              const isToday = todayStr === dateStr;
              const disabledDay = isDateDisabled(date);

              return (
                <button
                  key={key}
                  type="button"
                  disabled={disabledDay}
                  onClick={() => handleSelectDate(date)}
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all",
                    !isCurrentMonth && "text-zinc-300",
                    isCurrentMonth && "text-zinc-800",
                    isCurrentMonth && !isSelected && !disabledDay && "hover:bg-primary/10 hover:text-primary",
                    isSelected && "bg-primary text-white font-bold shadow-md hover:bg-primary",
                    isToday && !isSelected && "border-2 border-secondary font-bold text-secondary",
                    disabledDay && "cursor-not-allowed opacity-25 hover:bg-transparent",
                  )}
                >
                  {date.getDate()}
                  {isToday && (
                    <span
                      className={cn(
                        "absolute bottom-1 h-1 w-1 rounded-full",
                        isSelected ? "bg-white" : "bg-secondary",
                      )}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer controls */}
          <div className="mt-3 flex items-center justify-between border-t border-primary/10 pt-2.5">
            <button
              type="button"
              onClick={() => handleSelectDate(new Date())}
              disabled={isDateDisabled(new Date())}
              className="text-xs font-bold text-secondary hover:underline disabled:opacity-50"
            >
              Select Today
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
