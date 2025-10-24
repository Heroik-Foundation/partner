import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
  subCategory?: {
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
  removeAllTickets: () => void;
  removeOrganization: (id: string) => void;
  pruneRedundantTickets: () => void;
  recalculateTicketIndex: () => void;
};

export const useEventFormStore = create<StaticEventFormStore>()(
  persist(
    (set) => ({
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
          if (!state.formState.ticketing) return state;

          const newTicketing = state.formState.ticketing.filter(
            (_, i) => i !== index
          );
          return {
            formState: {
              ...state.formState,
              ticketing: newTicketing,
              currentTicketIndex:
                newTicketing.length > 0 ? newTicketing.length : 0,
            },
          };
        }),
      removeAllTickets: () =>
        set((state) => ({
          formState: {
            ...state.formState,
            ticketing: [],
            currentTicketIndex: 0,
          },
        })),
      removeOrganization: (id) =>
        set((state) => {
          const organizations = state.formState.fundRaiser?.organizations;
          if (!organizations) return state;

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
      pruneRedundantTickets: () =>
        set((state) => {
          if (!state.formState.ticketing) return state;

          const newTicketing = state.formState.ticketing.filter(
            (ticket) =>
              ticket.ticketType &&
              ticket.ticketPrice > 0 &&
              ticket.signUpLimit > 0 &&
              ticket.salesStartDate !== null &&
              ticket.salesEndDate !== null
          );
          return {
            formState: {
              ...state.formState,
              ticketing: newTicketing,
              currentTicketIndex:
                newTicketing.length > 0 ? newTicketing.length : 0,
            },
          };
        }),
      recalculateTicketIndex: () =>
        set((state) => ({
          formState: {
            ...state.formState,
            currentTicketIndex: state.formState.ticketing?.length || 0,
          },
        })),
    }),
    {
      name: "event-form-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
