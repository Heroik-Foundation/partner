"use client";

import { format } from "date-fns";
import calendar from "@/assets/dashboard/calendar.svg";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDateRangeState } from "@/hooks/store/data-range";

export function DatePicker() {
  const { endDate, setStartDate, startDate, setEndDate } = useDateRangeState();

  return (
    <div className="flex flex-col space-y-2 lg:space-y-0 lg:flex-row lg:items-center lg:space-x-5 w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "font-cairo justify-start text-left font-normal shadow-sm border-none rounded-sm"
            )}
          >
            <img src={calendar} className="mr-2 h-3 w-3" />
            {startDate ? format(startDate, "PPP") : <span>Start date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            //@ts-ignore
            onSelect={setStartDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "font-cairo justify-start text-left font-normal shadow-sm border-none rounded-sm"
            )}
          >
            <img src={calendar} className="mr-2 h-3 w-3" />
            {endDate ? format(endDate, "PPP") : <span>End date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            //@ts-ignore
            onSelect={setEndDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
