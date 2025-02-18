import { create } from "zustand";

interface DateRange {
  startDate: Date | undefined;
  endDate: Date | undefined;
  setStartDate: (startDate: Date) => void;
  setEndDate: (startDate: Date) => void;
}

export const useDateRangeState = create<DateRange>((set) => ({
  startDate: undefined,
  endDate: undefined,
  setStartDate: (startDate: Date) => set({ startDate }),
  setEndDate: (endDate: Date) => set({ endDate }),
}));
