// utils/numberInputHelpers.ts
// Reusable helper for sanitizing numeric input strings
// Allows digits and one decimal point; prevents NaN by ensuring valid format

/**
 * Sanitizes a raw input string to a valid numeric string.
 * - Strips non-digit/non-decimal characters.
 * - Ensures only one decimal point.
 * - Allows empty string.
 * @param rawValue - The raw input from the event.target.value
 * @returns Cleaned numeric string or empty
 */
export const sanitizeNumericInput = (rawValue: string): string => {
  if (typeof rawValue !== "string") return "";

  // Strip everything except digits and one decimal point
  let cleanValue = rawValue.replace(/[^0-9.]/g, "");

  // Prevent multiple decimal points (e.g., "1.2.3" -> "1.23")
  const parts = cleanValue.split(".");
  if (parts.length > 2) {
    cleanValue = parts[0] + "." + parts.slice(1).join("");
  }

  return cleanValue;
};

/**
 * Safely parses a sanitized numeric string to a number.
 * - Returns NaN for invalid/empty, but you can fallback with || 0
 * - Useful for form submission or calculations
 * @param value - Sanitized string (or empty)
 * @returns Parsed number or NaN if invalid
 */
export const parseSafeNumber = (value: string): number => {
  if (value === "") return NaN; // Explicitly return NaN for empty (handle with fallback)
  return parseFloat(value);
};

/**
 * Validates if a value is a valid non-empty number.
 * @param value - Input value
 * @returns True if valid number
 */
export const isValidNumber = (value: string): boolean => {
  return value !== "" && !isNaN(parseSafeNumber(value));
};
