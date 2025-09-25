import { ChangeEvent } from "react";

export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) {
    return text;
  }

  return text.slice(0, length) + "...";
}

export function formatCurrency(amount: number): string {
  const value = amount ? Number(amount) / 100 : 0;
  return value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });
}

export function formatNumberSequence(sequence: string): string {
  const cleanedSequence = sequence.replace(/\D/g, "");

  const length = cleanedSequence.length;

  if (length < 4) {
    throw new Error("Sequence must contain at least 4 digits.");
  }

  let formattedString = "";

  const numSets = Math.floor((length - 4) / 4);
  for (let i = 0; i < numSets; i++) {
    formattedString += "xxxx-";
  }

  formattedString += cleanedSequence.slice(-4);

  return formattedString;
}

export function handleNumericInput(
  e: ChangeEvent<HTMLInputElement>
): number | undefined {
  const value = e.target.value;

  if (/^\d+$/.test(value)) {
    return Number(value);
  }

  return undefined;
}

export const decimalFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
