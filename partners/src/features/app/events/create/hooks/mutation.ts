import { Event } from "@/features/app/global/types";
import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { convertDateTimeInputToISOString } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

type CreateEventMutation = {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  eventTicket: {
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
  endDate: string;
  address: string;
  signUpLimit: number;
  subCategory?: string;
  communityId?: string;
  photo: File | null;
};

export function useCreateEventMutation(props: CreateEventMutation) {
  const {
    name,
    description,
    eventTicket,
    eventPledge,
    category,
    privacy,
    eventEndDate,
    endDate,
    startTime,
    endTime,
    subCategory,
    address,
    signUpLimit,
    communityId,
    photo,
  } = props;
  const { navigate } = useRouter();
  return useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("privacy", privacy);

      if (startTime && endTime && endTime && eventEndDate) {
        //Start date
        formData.append(
          "endTime",
          convertDateTimeInputToISOString(endDate, startTime)
        );

        //End date
        formData.append(
          "eventEndDate",
          convertDateTimeInputToISOString(eventEndDate, endTime)
        );
      } else {
        toast.error("Invalid date, please select another date");
        throw new Error("Invalid date");
      }

      formData.append("address", address);

      if (subCategory) {
        formData.append("subcategory", subCategory);
      }

      formData.append("signUpLimit", signUpLimit.toString());

      if (communityId) {
        formData.append("communityId", communityId);
      }

      // formData.append(
      //   "eventTicket[totalTicket]",
      //   eventTicket.totalTicket.toString()
      // );

      formData.append(
        "eventTicket[ticketPrice]",
        (eventTicket.ticketPrice * 100).toString()
      );

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

      const { data } = await authenticatedInstance.post(
        "/event-partners/create-event",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
    onSuccess: (data: { event: Event }) => {
      toast.success("Event created successfully");
      navigate({
        to: "/app/events/$id/success",
        params: {
          id: String(data.event._id),
        },
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
      console.error("Mutation error:", error);
    },
  });
}
