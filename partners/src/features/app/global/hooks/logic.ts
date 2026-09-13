import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type EventFormBase = {
  absorbFees: boolean;
  photo: File | string | undefined;
  name: string;
  description: string;
  category: {
    name: string;
    id: string;
    image: string;
  };
  promoCode?: {
    code: string;
    discount: number;
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
  isRefundable: boolean;
};

type OnlineEventForm = EventFormBase & {
  isOnlineEvent: true;
  meetingLink: string;
  address?: never;
  latitude?: never;
  longitude?: never;
};

type InPersonEventForm = EventFormBase & {
  isOnlineEvent: false;
  address: string;
  latitude: number;
  longitude: number;

  meetingLink?: never;
};

export type EventFormState = OnlineEventForm | InPersonEventForm;

export type EventFormRecurrenceState = {
  interval: number;
  frequency: "WEEKLY" | "MONTHLY";
  daysOfWeek?: number[]; // 0=Sunday, 6=Saturday (for weekly recurrence)
  endType: "NEVER" | "UNTIL_DATE" | "AFTER_OCCURRENCES";
  endDate?: string; // ISO string (required if endType is 'UNTIL_DATE')
  occurrenceCount?: number; // Required if endType is 'AFTER_OCCURRENCES'
};

export type TicketTierState = {
  ticketType: string;
  ticketPrice: number;
  signUpLimit: number;
  salesStartDate: string | null;
  salesEndDate: string | null;
  ticketDetails?: string;
};

export type FundraiserState = {
  fundRaisingGoal?: number;
  recipientCharities?: string[];
};

export const defaultValue: EventFormState = {
  absorbFees: false,
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
  isOnlineEvent: false,
  isRefundable: false,
};

type StaticEventFormStore = {
  formState: EventFormState;
  setFormState: (state: EventFormState) => void;
  reset: () => void;
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K],
  ) => void;
  deleteTicketTier: (index: number) => void;
  removeAllTickets: () => void;
  removeOrganization: (id: string) => void;
  pruneRedundantTickets: () => void;
  recalculateTicketIndex: () => void;
  reorderTickets: (fromIndex: number, toIndex: number) => void;
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
            (_, i) => i !== index,
          );
          const nextIndex =
            newTicketing.length > 0
              ? Math.min(
                  Math.max(0, state.formState.currentTicketIndex),
                  newTicketing.length - 1,
                )
              : 0;

          return {
            formState: {
              ...state.formState,
              ticketing: newTicketing,
              currentTicketIndex: nextIndex,
            },
          };
        }),
      reorderTickets: (fromIndex: number, toIndex: number) =>
        set((state) => {
          if (!state.formState.ticketing) return state;
          const tickets = [...state.formState.ticketing];
          const [moved] = tickets.splice(fromIndex, 1);
          tickets.splice(toIndex, 0, moved);
          return {
            formState: {
              ...state.formState,
              ticketing: tickets,
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
          const organizations = state.formState.fundRaiser?.recipientCharities;
          if (!organizations) return state;

          return {
            formState: {
              ...state.formState,
              fundRaiser: {
                ...state.formState.fundRaiser,
                recipientCharities: organizations.filter((org) => org !== id),
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
              ticket.salesStartDate &&
              ticket.salesEndDate,
          );
          const nextIndex =
            newTicketing.length > 0
              ? Math.min(
                  Math.max(0, state.formState.currentTicketIndex),
                  newTicketing.length - 1,
                )
              : 0;

          return {
            formState: {
              ...state.formState,
              ticketing: newTicketing,
              currentTicketIndex: nextIndex,
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
    },
  ),
);
