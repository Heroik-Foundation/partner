import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { convertDateTimeInputToISOString } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UpdateEventMutation {
  photo?: File | string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  category: {
    name: string;
    id: string;
    image: string;
  };
  subCategory: {
    name: string;
    id: string;
    image: string;
  };
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  privacy: string;
  eventId: string;
}

export function useUpdateEventMutation(props: UpdateEventMutation) {
  const {
    name,
    description,
    category,
    subCategory,
    privacy,
    endDate,
    startDate,
    endTime,
    startTime,
    address,
    photo,
    eventId,
    latitude,
    longitude,
  } = props;

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category.id);
      formData.append("privacy", privacy);
      formData.append("longitude", String(longitude));
      formData.append("latitude", String(latitude));
      formData.append("address", address);

      if (subCategory.id !== "") {
        formData.append("subCategory", subCategory.id);
      }

      // Start date & time
      formData.append(
        "endTime",
        convertDateTimeInputToISOString(startDate, startTime)
      );

      // End date & time
      formData.append(
        "eventEndDate",
        convertDateTimeInputToISOString(endDate, endTime)
      );

      if (photo && typeof photo !== "string") {
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
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("event-details") ||
          query.queryKey.includes("user-events"),
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
      console.error("Mutation error:", error);
    },
  });
}
