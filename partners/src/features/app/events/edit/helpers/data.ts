import { Event } from "@/features/app/global/types";
import { getTimeFromISO } from "@/helpers/time";

export const getInitialEventState = (eventData: Event) => {
  const startTime = eventData?.endTime ? getTimeFromISO(eventData.endTime) : "";
  const endTime = eventData?.endTime
    ? getTimeFromISO(eventData.eventEndDate)
    : "";

  const startDate = eventData.endTime.split("T")[0];
  const endDate = eventData.eventEndDate.split("T")[0];

  const longitude = eventData.loc.coordinates[0];
  const latitude = eventData.loc.coordinates[1];

  return {
    absorbFees: eventData.absorbFees,
    name: eventData.name || "",
    description: eventData.description || "",
    address: eventData.address || "",
    longitude,
    latitude,
    category: {
      name: eventData.category.name || "",
      id: eventData.category._id || "",
      image: eventData.category.image || "",
    },
    subCategory: { name: "", id: "", image: "" },
    startDate: startDate,
    endDate: endDate,
    startTime: startTime,
    endTime: endTime,
    privacy: eventData.privacy || "",
    photo: eventData.photo || undefined,
    eventId: eventData._id || "",
  };
};
