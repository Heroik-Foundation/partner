import { useCurrencyStore } from "@/stores/currency";

interface ProcessingFeeConfig {
  rate: number;
  fixed: number;
}

const PROCESSING_FEE_CONFIGS: Record<string, ProcessingFeeConfig> = {
  usd: { rate: 0.044, fixed: 0.3 }, // 2.9% + 1.5% intl ≈ 4.4% (common for non-US)
  gbp: { rate: 0.0325, fixed: 0.2 }, // ~3.25% effective for non-UK merchants (intl/cross-border)
  eur: { rate: 0.0325, fixed: 0.25 }, // Similar for non-EEA
  aud: { rate: 0.035, fixed: 0.3 },
  cad: { rate: 0.044, fixed: 0.3 },
  nzd: { rate: 0.035, fixed: 0.3 },
  default: { rate: 0.035, fixed: 0.3 },
};

export const calculateFees = (
  ticketPrice: number,
  absorbFees: boolean,
  hiroekFee: number,
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
  const currency = selectedCurrency.value.toLowerCase();

  const config =
    PROCESSING_FEE_CONFIGS[currency] ?? PROCESSING_FEE_CONFIGS.default;

  const processingFee =
    Number((ticketPrice * config.rate + config.fixed).toFixed(2)) - 0.01;

  const totalFees = hiroekFee + processingFee;

  if (absorbFees) {
    return {
      hiroekFee,
      processingFee,
      totalFees,
      buyersPay: ticketPrice,
      youReceive: Math.max(0, Number((ticketPrice - totalFees).toFixed(2))),
    };
  } else {
    return {
      hiroekFee,
      processingFee,
      totalFees,
      buyersPay: Number((ticketPrice + totalFees).toFixed(2)),
      youReceive: ticketPrice,
    };
  }
};

export const getProcessingFeeDisplay = (currency: string, symbol: string) => {
  const currencyValue = currency.toLowerCase();

  const feeDisplay: Record<string, string> = {
    usd: `4.4% + ${symbol}0.30`, // 2.9% base + 1.5% international (common for non-US merchants)
    gbp: `2.9% + ${symbol}0.20`, // Effective with international/cross-border addon
    eur: `2.9% + ${symbol}0.25`,
    aud: `3.5% + ${symbol}0.30`, // Domestic + international addon
    cad: `4.4% + ${symbol}0.30`,
    nzd: `3.5% + ${symbol}0.30`, // Updated lower international rates in 2026; conservative
  };

  return feeDisplay[currencyValue] || `4.4% + ${symbol}0.30`;
};

export const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
