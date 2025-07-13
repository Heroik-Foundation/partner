import { EventOrganization } from "@/features/app/global/types";
import { getTimeFromISO } from "@/helpers/time";

export const getInitialEventState = (eventData: any) => {
  const startTime = eventData?.endTime ? getTimeFromISO(eventData.endTime) : "";
  const endTime = eventData?.endTime
    ? getTimeFromISO(eventData.eventEndDate)
    : "";

  return {
    photo: eventData?.photo || "",
    name: eventData?.name || "",
    startTime,
    endTime,
    description: eventData?.description || "",
    address: eventData?.address || "",
    longitude: eventData?.longitude || 0,
    latitude: eventData?.latitude || 0,
    subCategory: {
      id: eventData.subcategory._id,
      name: eventData.subcategory.name,
    },
    signUpLimit: eventData?.signUpLimit || 0,
    category: {
      id: eventData.category._id,
      name: eventData.category.name,
    },
    startDate: eventData?.endTime.split("T")[0] || "",
    endDate: eventData?.eventEndDate.split("T")[0] || "",
    isPaid: Number(eventData?.eventTicket.ticketPrice || 0) > 0,
    isFundraiser: true,
    ticketPrice: Number(Number(eventData?.eventTicket.ticketPrice || 0) / 100),
    minimumPledge: Number(
      Number(eventData?.eventPledge?.minimumPledge || 0) / 100
    ),
    charityPartners:
      eventData?.eventPledge?.organizations.map(
        (organization: EventOrganization) => ({
          name: organization.name,
          id: organization._id,
        })
      ) || [],
  };
};
