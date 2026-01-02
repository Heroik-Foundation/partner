import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CurrencyCode = "gbp" | "usd" | "eur" | "aud" | "cad" | "nzd";

export enum CurrencyCodeEnum {
  GBP = "gbp",
  USD = "usd",
  EUR = "eur",
  AUD = "aud",
  CAD = "cad",
  NZD = "nzd",
}

type Currency = {
  value: CurrencyCode;
  symbol: string;
};

export interface CurrencyDetails {
  value: CurrencyCode;
  symbol: string;
  code: string;
  flag: string;
}

export const currencies: CurrencyDetails[] = [
  {
    value: "gbp",
    code: "gb",
    flag: "https://flagcdn.com/w20/gb.png",
    symbol: "£",
  },
  {
    value: "usd",
    code: "us",
    flag: "https://flagcdn.com/w20/us.png",
    symbol: "$",
  },
  {
    value: "eur",
    code: "eu",
    flag: "https://flagcdn.com/w20/eu.png",
    symbol: "€",
  },
  {
    value: "aud",
    code: "au",
    flag: "https://flagcdn.com/w20/au.png",
    symbol: "A$",
  },
  {
    value: "cad",
    code: "ca",
    flag: "https://flagcdn.com/w20/ca.png",
    symbol: "C$",
  },
  {
    value: "nzd",
    code: "nz",
    flag: "https://flagcdn.com/w20/nz.png",
    symbol: "NZ$",
  },
];

interface CurrencyStore {
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;

  // Utility functions
  getSymbolByValue: (value: string) => string | undefined;
  getCurrencyBySymbol: (symbol: string) => CurrencyDetails | undefined;
}

const DEFAULT_CURRENCY: Currency = { value: "gbp", symbol: "£" };

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      selectedCurrency: DEFAULT_CURRENCY,

      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),

      getSymbolByValue: (value: string) => {
        const found = currencies.find(
          (c) => c.value.toLowerCase() === value.toLowerCase()
        );
        return found?.symbol;
      },

      getCurrencyBySymbol: (symbol: string) => {
        return currencies.find((c) => c.symbol === symbol);
      },
    }),
    {
      name: "currency-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ selectedCurrency: state.selectedCurrency }),
    }
  )
);
