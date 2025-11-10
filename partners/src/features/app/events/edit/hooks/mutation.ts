import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import {
  convertDateTimeInputToISOString,
  getTimeFromISO,
} from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Event } from "@/features/app/global/types";
import { frmz } from "frmz";

export interface UpdateEventMutation {
  event: Event | undefined;
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
  subCategory?: {
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
    event,
  } = props;

  const queryClient = useQueryClient();

  const updatedFields: Record<string, any> = {};

  return useMutation({
    mutationFn: async () => {
      if (!event) {
        throw new Error("Original event data is missing to determine changes.");
      }

      if (name !== event.name) {
        updatedFields.name = name;
      }

      if (description !== event.description) {
        updatedFields.description = description;
      }

      if (category.id !== event.category._id) {
        updatedFields.category = category.id;
      }

      if (privacy !== event.privacy) {
        updatedFields.privacy = privacy;
      }

      if (address !== event.address) {
        updatedFields.address = address;
      }

      // Handle location change (comparing against [longitude, latitude])
      if (
        latitude !== event.loc.coordinates[1] ||
        longitude !== event.loc.coordinates[0]
      ) {
        updatedFields.latitude = latitude;
        updatedFields.longitude = longitude;
      }

      if (subCategory && subCategory.id !== "") {
        updatedFields.subCategory = subCategory.id;
      }

      const newStartTime = convertDateTimeInputToISOString(
        startDate,
        startTime
      );

      const newEndTime = convertDateTimeInputToISOString(endDate, endTime);

      const initialStartDate = event.endTime.split("T")[0];
      const initialEndDate = event.eventEndDate.split("T")[0];

      if (
        initialStartDate !== startDate ||
        startTime !== getTimeFromISO(event.endTime)
      ) {
        updatedFields.endTime = newStartTime;
      }

      if (
        initialEndDate !== endDate ||
        endTime !== getTimeFromISO(event.eventEndDate)
      ) {
        updatedFields.eventEndDate = newEndTime;
      }

      if (photo && typeof photo !== "string") {
        updatedFields.photo = photo;
      }

      if (Object.keys(updatedFields).length === 0) {
        return;
      }

      const { getFormData } = frmz(updatedFields);

      const { data } = await authenticatedInstance.patch(
        `/event-partners/update-event/${eventId}`,
        getFormData()
      );

      return data;
    },
    onSuccess: () => {
      if (Object.keys(updatedFields).length === 0) {
        return;
      } else {
        toast.success("Event updated successfully", {
          id: "completed-event-edit",
        });

        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.includes("event-details") ||
            query.queryKey.includes("user-events"),
        });
      }
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
      console.error("Mutation error:", error);
    },
  });
}
