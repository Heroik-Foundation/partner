import { useCurrencyStore } from "@/stores/currency";

const HIROEK_FIXED_EQUIVALENTS: Record<string, number> = {
  gbp: 0.6,
  usd: 0.6, // Changed from 0.81 to USD equivalent of £0.60
  eur: 0.6, // Changed from 0.71 to EUR equivalent of £0.60
  aud: 0.6, // Changed from 1.21 to AUD equivalent of £0.60
  cad: 0.6, // Changed from 1.11 to CAD equivalent of £0.60
  nzd: 0.6, // Changed from 1.4 to NZD equivalent of £0.60
};

interface ProcessingFeeConfig {
  rate: number;
  fixed: number;
}

const PROCESSING_FEE_CONFIGS: Record<string, ProcessingFeeConfig> = {
  gbp: { rate: 0.014, fixed: 0.2 }, // Existing GBP config (already set up)
  usd: { rate: 0.029, fixed: 0.3 }, // Stripe: 2.9% + $0.30
  eur: { rate: 0.015, fixed: 0.25 }, // Stripe: 1.5% + €0.25
  aud: { rate: 0.0175, fixed: 0.3 }, // Stripe: 1.75% + A$0.30
  cad: { rate: 0.029, fixed: 0.3 }, // Stripe: 2.9% + CA$0.30
  nzd: { rate: 0.0265, fixed: 0.3 }, // Stripe: 2.65% + NZ$0.30
  default: { rate: 0.0325, fixed: 0.3 }, // Other international: 3.25% + 0.30
};

export const calculateFees = (ticketPrice: number, absorbFees: boolean) => {
  if (ticketPrice === 0) {
    return {
      hiroekFee: 0,
      processingFee: 0,
      totalFees: 0,
      buyersPay: 0,
      youReceive: 0,
    };
  }

  const { selectedCurrency } = useCurrencyStore.getState();
  const currencyValue = selectedCurrency.value.toLowerCase();

  const hiroekFee =
    HIROEK_FIXED_EQUIVALENTS[currencyValue] ?? HIROEK_FIXED_EQUIVALENTS.gbp;

  const config =
    PROCESSING_FEE_CONFIGS[currencyValue] ?? PROCESSING_FEE_CONFIGS.default;
  const processingFee = ticketPrice * config.rate + config.fixed;

  const totalFees = hiroekFee + processingFee;

  if (absorbFees) {
    return {
      hiroekFee,
      processingFee,
      totalFees,
      buyersPay: ticketPrice,
      youReceive: ticketPrice - totalFees,
    };
  } else {
    return {
      hiroekFee,
      processingFee,
      totalFees,
      buyersPay: ticketPrice + totalFees,
      youReceive: ticketPrice,
    };
  }
};

export const getProcessingFeeDisplay = (currency: string, symbol: string) => {
  const currencyValue = currency.toLowerCase();
  const feeDisplay: Record<string, string> = {
    gbp: `1.4% + ${symbol}0.20`,
    usd: `2.9% + ${symbol}0.30`,
    eur: `1.5% + ${symbol}0.25`,
    aud: `1.75% + ${symbol}0.30`,
    cad: `2.9% + ${symbol}0.30`,
    nzd: `2.65% + ${symbol}0.30`,
  };
  return feeDisplay[currencyValue] || `3.25% + ${symbol}0.30`;
};

export const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
