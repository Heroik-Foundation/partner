export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) {
    return text;
  }

  return text.slice(0, length) + "...";
}

export function formatCurrency(amount: number): string {
  const value = amount ? amount : 0;
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}
