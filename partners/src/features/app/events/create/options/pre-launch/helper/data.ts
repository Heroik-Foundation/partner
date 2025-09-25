import { EventFormRecurrenceState } from "@/features/app/global/hooks/logic";

export function mapRecurrenceStateToMutation(state?: EventFormRecurrenceState):
  | {
      interval: number;
      frequency: "WEEKLY" | "MONTHLY";
      daysOfWeek: number[];
      endType: "NEVER" | "UNTIL_DATE" | "AFTER_OCCURRENCES";
      endDate?: string;
      occurrenceCount?: number;
    }
  | undefined {
  if (!state) return undefined;

  const { interval, frequency, daysOfWeek, endType, endDate, occurrenceCount } =
    state;

  // Required checks
  if (interval == null) return undefined;
  if (!frequency) return undefined;
  if (!endType) return undefined;

  // Weekly requires daysOfWeek
  if (frequency === "WEEKLY" && (!daysOfWeek || daysOfWeek.length === 0)) {
    return undefined;
  }

  // UNTIL_DATE requires endDate
  if (endType === "UNTIL_DATE" && !endDate) {
    return undefined;
  }

  // AFTER_OCCURRENCES requires occurrenceCount
  if (endType === "AFTER_OCCURRENCES" && !occurrenceCount) {
    return undefined;
  }

  return {
    interval,
    frequency,
    daysOfWeek: daysOfWeek ?? [],
    endType,
    ...(endDate && { endDate }),
    ...(occurrenceCount && { occurrenceCount }),
  };
}
