import { create } from "zustand";

interface BaseEventFormData {
  photo: File | any;
  name: string;
  description: string;
  address: string;
  signUpLimit: number;
  category: string;
  startDate: string;
  endDate: string;
}

export interface EventFormState extends BaseEventFormData {
  isPaid: boolean;
  isFundraiser: boolean;
  ticketPrice: number | null;
  minimumPledge: number | null;
  charityPartners: string[];
}

const defaultValue: EventFormState = {
  photo: null,
  name: "",
  description: "",
  address: "",
  signUpLimit: 0,
  category: "",
  startDate: "",
  endDate: "",
  isPaid: false,
  isFundraiser: false,
  ticketPrice: null,
  minimumPledge: null,
  charityPartners: [],
};

type StaticEventFormStore = {
  formState: EventFormState;
  setFormState: (state: EventFormState) => void;
  reset: () => void;
  setPaid: (isPaid: boolean) => void;
  setFundraiser: (isFundraiser: boolean) => void;
  updateForm: <K extends keyof EventFormState>(
    field: K,
    value: EventFormState[K]
  ) => void;
};

export const useEventFormStore = create<StaticEventFormStore>((set) => ({
  formState: defaultValue,
  setFormState: (state) => set(() => ({ formState: state })),
  reset: () => set(() => ({ formState: defaultValue })),
  setPaid: (isPaid) =>
    set((state) => ({
      formState: {
        ...state.formState,
        isPaid,
        ticketPrice: isPaid ? (state.formState.ticketPrice ?? 0) : null,
      },
    })),
  setFundraiser: (isFundraiser) =>
    set((state) => ({
      formState: {
        ...state.formState,
        isFundraiser,
        minimumPledge: isFundraiser
          ? (state.formState.minimumPledge ?? 0)
          : null,
      },
    })),
  updateForm: (field, value) =>
    set((state) => ({
      formState: {
        ...state.formState,
        [field]: value,
      },
    })),
}));
