import { Event } from "@/features/app/global/types";
import { safeExtractDate, safeGetTimeFromISO } from "./time";
import { getSafeCoordinate } from "./location";

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

  const isOnlineEvent = eventData.meetingLink ? true : false;

  const locationData = eventData.meetingLink
    ? { meetingLink: eventData.meetingLink }
    : {
        address: eventData.address || "",
        longitude,
        latitude,
      };

  return {
    absorbFees: Boolean(eventData?.absorbFees),
    name: eventData?.name || "",
    description: eventData?.description || "",
    ...locationData,
    isOnlineEvent,

    category,
    subCategory: { name: "", id: "", image: "" },
    startDate,
    endDate,
    startTime,
    endTime,
    privacy: eventData?.privacy || "",
    photo: eventData?.photo || undefined,
    eventId: eventData?._id || "",
    isRefundable: eventData?.isRefundable || false,
  };
};
