import { useCurrencyStore } from "@/stores/currency";

interface ProcessingFeeConfig {
  rate: number;
  fixed: number;
}

const PROCESSING_FEE_CONFIGS: Record<string, ProcessingFeeConfig> = {
  gbp: { rate: 0.014, fixed: 0.2 },
  usd: { rate: 0.029, fixed: 0.3 },
  eur: { rate: 0.015, fixed: 0.25 },
  aud: { rate: 0.0175, fixed: 0.3 },
  cad: { rate: 0.029, fixed: 0.3 },
  nzd: { rate: 0.0265, fixed: 0.3 },
  default: { rate: 0.0325, fixed: 0.3 },
};

const INTERNATIONAL_FALLBACK: ProcessingFeeConfig = {
  rate: 0.0325,
  fixed: 0.3,
};

export const calculateFees = (
  ticketPrice: number,
  absorbFees: boolean,
  hiroekFee: number,
  isInternationalCard: boolean = false,
  overrideCurrency?: string
) => {
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
  const currencyValue = (
    overrideCurrency || selectedCurrency.value
  ).toLowerCase();

  let config =
    PROCESSING_FEE_CONFIGS[currencyValue] ?? PROCESSING_FEE_CONFIGS.default;

  if (isInternationalCard) {
    config = INTERNATIONAL_FALLBACK;
  }

  const processingFee = ticketPrice * config.rate + config.fixed;

  const totalFees = hiroekFee + processingFee;

  if (absorbFees) {
    return {
      hiroekFee,
      processingFee,
      totalFees,
      buyersPay: ticketPrice,
      youReceive: Math.max(0, ticketPrice - totalFees),
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
