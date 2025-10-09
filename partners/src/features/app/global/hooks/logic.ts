import { create } from "zustand";

export interface EventFormState {
  absorbFees: boolean;
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
  currentTicketIndex: number;
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
};

export type FundraiserState = {
  fundRaisingGoal?: number;
  organizations?: { name: string; id: string }[];
};

export const defaultValue: EventFormState = {
  absorbFees: true,
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
  currentTicketIndex: 0,
  ticketing: [],
};

type StaticEventFormStore = {
  formState: EventFormState;
  setFormState: (state: EventFormState) => void;
  reset: () => void;
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => void;
  deleteTicketTier: (index: number) => void;
  removeOrganization: (id: string) => void;
};

export const useEventFormStore = create<StaticEventFormStore>((set) => ({
  formState: defaultValue,
  setFormState: (state) => set(() => ({ formState: state })),
  reset: () => {
    set(() => ({ formState: defaultValue }));
  },
  updateForm: (field, value) =>
    set((state) => ({
      formState: {
        ...state.formState,
        [field]: value,
      },
    })),
  deleteTicketTier: (index: number) =>
    set((state) => {
      if (!state.formState.ticketing) return state; // nothing to delete

      return {
        formState: {
          ...state.formState,
          ticketing: state.formState.ticketing.filter((_, i) => i !== index),
        },
      };
    }),
  removeOrganization: (id) =>
    set((state) => {
      const organizations = state.formState.fundRaiser?.organizations;
      if (!organizations) return state; // nothing to delete

      return {
        formState: {
          ...state.formState,
          fundRaiser: {
            ...state.formState.fundRaiser,
            organizations: organizations.filter((org) => org.id !== id),
          },
        },
      };
    }),
}));
