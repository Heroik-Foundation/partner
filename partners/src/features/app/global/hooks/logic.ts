import { create } from "zustand";

interface BaseEventFormData {
  photo: File | any;
  name: string;
  description: string;
  address: string;
  signUpLimit: number;
  latitude: number;
  longitude: number;
  category: {
    name: string;
    id: string;
  };
  startTime: string;
  endTime: string;
  subCategory: {
    name: string;
    id: string;
  };
  startDate: string;
  endDate: string;
}

export interface EventFormState extends BaseEventFormData {
  isFundraiser: boolean;
  isPaid: boolean;
  ticketPrice: number | null;
  minimumPledge: number | null;
  charityPartners: { name: string; id: string }[];
}

const defaultValue: EventFormState = {
  photo: null,
  name: "",
  description: "",
  startTime: "",
  endTime: "",
  address: "",
  signUpLimit: 0,
  latitude: 0,
  longitude: 0,
  category: {
    name: "",
    id: "",
  },
  subCategory: {
    name: "",
    id: "",
  },
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
