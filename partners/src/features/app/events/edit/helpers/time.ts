import { getTimeFromISO } from "@/helpers/time";

export const safeGetTimeFromISO = (
  dateString: string | null | undefined
): string => {
  if (!dateString) return "";
  try {
    return getTimeFromISO(dateString);
  } catch (error) {
    console.warn("Error parsing time from ISO:", error);
    return "";
  }
};

export const safeExtractDate = (
  dateString: string | null | undefined
): string => {
  if (!dateString || typeof dateString !== "string") return "";
  try {
    return dateString.split("T")[0] || "";
  } catch (error) {
    console.warn("Error extracting date from string:", error);
    return "";
  }
};
