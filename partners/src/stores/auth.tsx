import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthForm {
  name: string;
  image: File | null;
  address: string;
  bio: string;
  email: string;
  number: string;
  code: string;
  events: number;
  password: string;
}

interface AuthStore {
  form: AuthForm;
  setForm: (form: AuthForm) => void;
  resetForm: () => void;
}

export const initialValues = {
  name: "",
  bio: "",
  image: null,
  address: "",
  email: "",
  number: "",
  code: "",
  events: 0,
  password: "",
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      form: initialValues,
      setForm: (form: AuthForm) => set({ form }),
      resetForm: () => set({ form: initialValues }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export { useAuthStore };
