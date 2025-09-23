const FEE_CONFIG = {
  hiroekFixedFee: 0.6,
  processingFeeRate: 0.015,
  processingFixedFee: 0.2,
};

export const calculateFees = (ticketPrice: number, absorbFees: boolean) => {
  const hiroekFee = FEE_CONFIG.hiroekFixedFee;
  const processingFee =
    ticketPrice * FEE_CONFIG.processingFeeRate + FEE_CONFIG.processingFixedFee;
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

export const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
