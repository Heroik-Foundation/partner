import { create } from "zustand";

export interface EventFormState {
  photo: File | string | undefined;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: {
    name: string;
    id: string;
    image: string;
  };
  subCategory: {
    name: string;
    id: string;
    image: string;
  };
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  privacy: string;
  eventId: string;

  recurrence?: EventFormRecurrenceState;
  ticketing?: TicketTierState[];
  fundRaiser?: FundraiserState;
}

export type EventFormRecurrenceState = {
  interval?: number;
  frequency?: "WEEKLY" | "MONTHLY";
  daysOfWeek?: number[]; // 0=Sunday, 6=Saturday (for weekly recurrence)
  endType?: "NEVER" | "UNTIL_DATE" | "AFTER_OCCURRENCES";
  endDate?: string; // ISO string (required if endType is 'UNTIL_DATE')
  occurrenceCount?: number; // Required if endType is 'AFTER_OCCURRENCES'
};

export type TicketTierState = {
  ticketType: string;
  ticketPrice: number;
  signUpLimit: number;
  salesStartDate: string | null;
  salesEndDate: string | null;
  absorbFees: boolean;
};

export type FundraiserState = {
  fundRaisingGoal?: number;
  organizations?: string[];
};

export const defaultValue: EventFormState = {
  photo: undefined,
  name: "",
  description: "",
  address: "",
  latitude: 0,
  longitude: 0,
  category: {
    name: "",
    id: "",
    image: "",
  },
  subCategory: {
    name: "",
    id: "",
    image: "",
  },
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  privacy: "",
  eventId: "",
};

type StaticEventFormStore = {
  formState: EventFormState;
  setFormState: (state: EventFormState) => void;
  reset: () => void;
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => void;
};

export const useEventFormStore = create<StaticEventFormStore>((set) => ({
  formState: defaultValue,
  setFormState: (state) => set(() => ({ formState: state })),
  reset: () => set(() => ({ formState: defaultValue })),
  updateForm: (field, value) =>
    set((state) => ({
      formState: {
        ...state.formState,
        [field]: value,
      },
    })),
}));
