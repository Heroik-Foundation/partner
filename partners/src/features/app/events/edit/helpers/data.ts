import { EventFormState } from "@/features/app/global/hooks/logic";

export const getInitialEventState = (eventData: any): EventFormState => ({
  photo: eventData?.photo || "",
  name: eventData?.name || "",
  description: eventData?.description || "",
  address: eventData?.address || "",
  signUpLimit: eventData?.signUpLimit || 0,
  category: eventData?.category || "",
  startDate: eventData?.endTime.split("T")[0] || "",
  endDate: eventData?.eventEndDate.split("T")[0] || "",
  isPaid: Number(eventData?.eventTicket?.ticketPrice || 0) > 0,
  isFundraiser: true,
  ticketPrice: Number(eventData?.eventTicket?.ticketPrice || 0),
  minimumPledge: Number(eventData?.eventPledge?.totalPledgedAmount || 0),
  charityPartners: eventData?.eventPledge?.organizations || [],
});
