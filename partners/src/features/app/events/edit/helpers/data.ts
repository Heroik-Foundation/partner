import { Event } from "@/features/app/global/types";
import { getTimeFromISO } from "@/helpers/time";

export const getInitialEventState = (eventData: Event | null | undefined) => {
  if (!eventData) {
    return {
      absorbFees: false,
      name: "",
      description: "",
      address: "",
      longitude: 0,
      latitude: 0,
      category: { name: "", id: "", image: "" },
      subCategory: { name: "", id: "", image: "" },
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      privacy: "",
      photo: undefined,
      eventId: "",
    };
  }

  // Safe time extraction with fallbacks
  const safeGetTimeFromISO = (
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

  const safeExtractDate = (dateString: string | null | undefined): string => {
    if (!dateString || typeof dateString !== "string") return "";
    try {
      return dateString.split("T")[0] || "";
    } catch (error) {
      console.warn("Error extracting date from string:", error);
      return "";
    }
  };

  const getSafeCoordinate = (
    coordinates: any[] | null | undefined,
    index: number,
    defaultValue: number = 0
  ): number => {
    if (!Array.isArray(coordinates) || coordinates.length <= index) {
      return defaultValue;
    }
    const coord = coordinates[index];
    return typeof coord === "number" ? coord : defaultValue;
  };

  const startTime = safeGetTimeFromISO(eventData?.endTime);
  const endTime = safeGetTimeFromISO(eventData?.eventEndDate);

  const startDate = safeExtractDate(eventData?.endTime);
  const endDate = safeExtractDate(eventData?.eventEndDate);

  const longitude = getSafeCoordinate(eventData?.loc?.coordinates, 0);
  const latitude = getSafeCoordinate(eventData?.loc?.coordinates, 1);

  const category = {
    name: eventData?.category?.name || "",
    id: eventData?.category?._id || eventData?.category?._id || "",
    image: eventData?.category?.image || "",
  };

  return {
    absorbFees: Boolean(eventData?.absorbFees),
    name: eventData?.name || "",
    description: eventData?.description || "",
    address: eventData?.address || "",
    longitude,
    latitude,
    category,
    subCategory: { name: "", id: "", image: "" },
    startDate,
    endDate,
    startTime,
    endTime,
    privacy: eventData?.privacy || "",
    photo: eventData?.photo || undefined,
    eventId: eventData?._id || "",
  };
};
