export const safeAmount = (amount: string) => Math.max(0, Number(amount) || 0);
