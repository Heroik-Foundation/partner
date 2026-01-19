import { useCurrencyStore } from "@/stores/currency";

interface ProcessingFeeConfig {
  rate: number;
  fixed: number;
}

const PROCESSING_FEE_CONFIGS: Record<string, ProcessingFeeConfig> = {
  usd: { rate: 0.044, fixed: 0.3 }, // 2.9% base + 1.5% international = 4.4% + $0.30 (most accurate default for NG/global)
  gbp: { rate: 0.029, fixed: 0.2 }, // ~1.4% domestic + 1.5% intl ≈ 2.9% + £0.20 (conservative; actual can be higher cross-border)
  eur: { rate: 0.029, fixed: 0.25 }, // ~1.5% domestic + 1.5% intl ≈ 2.9–3% + €0.25
  aud: { rate: 0.035, fixed: 0.3 }, // ~1.75–2% domestic + 1.5% intl ≈ 3.5% + A$0.30 (from AU examples)
  cad: { rate: 0.044, fixed: 0.3 }, // 2.9% base + 1.5% intl = 4.4% + C$0.30
  nzd: { rate: 0.041, fixed: 0.3 }, // Approximate 2.6% + 1.5% intl ≈ 4.1%
  default: { rate: 0.044, fixed: 0.3 },
};
const INTERNATIONAL_CONFIG: ProcessingFeeConfig = {
  rate: 0.029 + 0.015,
  fixed: 0.3,
};

export const calculateFees = (
  ticketPrice: number,
  absorbFees: boolean,
  hiroekFee: number,
  isInternationalCard: boolean = true, // Default to true — safer for NG/global audience
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
  const currency = (overrideCurrency || selectedCurrency.value).toLowerCase();

  // Start with per-currency (domestic) if available
  let config =
    PROCESSING_FEE_CONFIGS[currency] ?? PROCESSING_FEE_CONFIGS.default;

  // Override for international cards — this is the key fix
  if (isInternationalCard) {
    config = INTERNATIONAL_CONFIG;
    // If currency conversion likely applies, you could bump rate: config.rate += 0.01; // +1%
  }

  // Optional: round to 2 decimals to avoid floating-point issues
  const processingFee = Number(
    (ticketPrice * config.rate + config.fixed).toFixed(2)
  );

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
