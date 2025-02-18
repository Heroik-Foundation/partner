import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type CreateEventMutation = {
  name: string;
  description: string;
  eventTicket?: {
    totalTicket: number;
    ticketPrice: number;
  };
  eventPledge?: {
    minimumPledge: number;
    organizations: string[];
  };
  category: string;
  privacy: string;
  eventEndDate: string;
  endTime: string;
  address: string;
  signUpLimit: number;
  eventId?: string;
  photo: File | null;
};

export function useUpdateEventMutation(props: CreateEventMutation) {
  const {
    name,
    description,
    eventTicket,
    eventPledge,
    category,
    privacy,
    eventEndDate,
    endTime,
    address,
    signUpLimit,
    photo,
    eventId,
  } = props;

  return useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("privacy", privacy);
      formData.append("eventEndDate", new Date(eventEndDate).toISOString());
      formData.append("endTime", new Date(endTime).toISOString());
      formData.append("address", address);
      formData.append("signUpLimit", signUpLimit.toString());

      if (eventTicket?.totalTicket) {
        formData.append(
          "eventTicket[totalTicket]",
          eventTicket.totalTicket.toString()
        );
      }
      if (eventTicket?.ticketPrice) {
        formData.append(
          "eventTicket[ticketPrice]",
          (eventTicket.ticketPrice * 100).toString()
        );
      }

      if (eventPledge?.minimumPledge) {
        formData.append(
          "eventPledge[minimumPledge]",
          (eventPledge.minimumPledge * 100).toString()
        );
        const pledgeOrganizations = eventPledge.organizations || [];
        pledgeOrganizations.forEach((org) => {
          formData.append("eventPledge[organizations][]", org);
        });
      }

      if (photo) {
        formData.append("photo", photo);
      }

      const { data } = await authenticatedInstance.patch(
        `/event-partners/update-event/${eventId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Event updated successfully");
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
      console.error("Mutation error:", error);
    },
  });
}
