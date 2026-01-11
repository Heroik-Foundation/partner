import { CurrencyQuoteQueryResponse } from "@/features/app/global/hooks/query";
import { currencies, CurrencyCode, useCurrencyStore } from "@/stores/currency";
import { ChangeEvent } from "react";

export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) {
    return text;
  }

  return text.slice(0, length) + "...";
}

export function formatCurrency(
  amount: number,
  currencyCode?: CurrencyCode
): string {
  const storeCurrency = useCurrencyStore.getState().selectedCurrency;

  const currency = currencyCode
    ? currencies.find((c) => c.value === currencyCode)
    : storeCurrency;

  const { value: currencyValue } = currency ?? {
    value: "gbp",
    symbol: "£",
  };

  const majorAmount = amount ? amount / 100 : 0;

  return majorAmount.toLocaleString("en-GB", {
    style: "currency",
    currency: currencyValue.toUpperCase(),
  });
}

export function extractMeetingLink(text: string): string {
  if (!text || typeof text !== "string") return "";

  const patterns = [
    // 1. Full Google Meet URLs
    {
      regex: /https?:\/\/meet\.google\.com\/[a-z0-9-]+/gi,
      transform: (match: string) => match.toLowerCase(),
    },

    // 2. Google Meet short codes (e.g., abc-defg-hij)
    {
      regex: /\b([a-z]{3}-[a-z]{4}-[a-z]{3})\b/gi,
      transform: (match: string) =>
        `https://meet.google.com/${match.toLowerCase().replace(/-/g, "")}`,
    },

    // 3. Telegram-style short links
    {
      regex: /\bt\.me(?:et)?\/([a-z0-9-]+)\b/gi,
      transform: (match: string) => {
        const code = match.split("/")[1];
        return `https://meet.google.com/${code.toLowerCase()}`;
      },
    },

    // 4. Zoom meetings
    {
      regex: /https?:\/\/(?:[\w-]+\.)?zoom\.us\/j\/\d+(?:\?pwd=[\w-]+)?/gi,
      transform: (match: string) => match,
    },

    // 5. Microsoft Teams meetings
    {
      regex: /https?:\/\/teams\.microsoft\.com\/l\/meetup-join\/[\w-]+/gi,
      transform: (match: string) => match,
    },

    // 6. Cisco Webex meetings
    {
      regex: /https?:\/\/(?:[\w-]+\.)?webex\.com\/(?:meet|join)\/[\w-]+/gi,
      transform: (match: string) => match,
    },
  ];

  // Clean input text
  const cleanedText = text
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/[\u200B-\u200D\uFEFF]/g, ""); // Remove zero-width characters

  // Try patterns in order
  for (const { regex, transform } of patterns) {
    const matches = cleanedText.match(regex);
    if (matches?.[0]) {
      const result = transform(matches[0]);
      if (isValidMeetingLink(result)) {
        return result;
      }
    }
  }

  return "";
}

function isValidMeetingLink(link: string): boolean {
  // Basic validation for meeting links
  if (!link || link.length < 15) return false;

  // Check for common meeting URL patterns
  const meetingDomains = [
    "meet.google.com",
    "zoom.us",
    "teams.microsoft.com",
    "webex.com",
  ];

  return meetingDomains.some((domain) => link.includes(domain));
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

export function trimNumber(value: string | number): number {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error("Invalid number format");
  }
  return num;
}

export function convertGbpTo(
  gbpAmount: number,
  currency: keyof CurrencyQuoteQueryResponse["quotes"],
  quotes?: CurrencyQuoteQueryResponse["quotes"]
): number | null {
  if (!quotes || quotes[currency] === undefined) {
    return null;
  }

  return gbpAmount * (quotes[currency] as number);
}
