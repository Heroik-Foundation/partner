// import { EventFormState } from "@/features/app/global/hooks/logic";

export const getInitialEventState = (eventData: any) => ({
  photo: eventData?.photo || "",
  name: eventData?.name || "",
  description: eventData?.description || "",
  address: eventData?.address || "",
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
  isPaid: Number(eventData?.eventTicket?.ticketPrice || 0) > 0,
  isFundraiser: true,
  ticketPrice: Number(Number(eventData?.eventTicket?.ticketPrice || 0) / 100),
  minimumPledge: Number(
    Number(eventData?.eventPledge?.totalPledgedAmount || 0) / 100
  ),
  charityPartners: eventData?.eventPledge?.organizations || [],
});
