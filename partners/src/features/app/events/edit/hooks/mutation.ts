import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import {
  convertDateTimeInputToISOString,
  getTimeFromISO,
} from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Event } from "@/features/app/global/types";
import { frmz } from "@/lib/frmz";
import { useNavigate } from "@tanstack/react-router";

// --- Types ---

type EventLocation =
  | {
      isOnlineEvent: true;
      meetingLink: string;
      address?: never;
      latitude?: never;
      longitude?: never;
    }
  | {
      isOnlineEvent: false;
      address: string;
      latitude: number;
      longitude: number;
      meetingLink?: never;
    };

type EventDateTimeFields = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
};

type EventCoreFields = {
  name: string;
  description: string;
  category: { name: string; id: string; image: string };
  subCategory?: { name: string; id: string; image: string };
  currency?: string;
  privacy: string;
  photo?: File | string;
};

// Diff mode — compares against original event
type DiffModeProps = EventCoreFields &
  EventDateTimeFields &
  EventLocation & {
    mode: "diff";
    event: Event;
  };

// Direct mode — pass only the fields you want to update
type DirectModeProps = {
  mode: "direct";
  updatedFields: Record<string, any>;
};

type UpdateEventMutationProps = (DiffModeProps | DirectModeProps) & {
  eventId: string;
};

// --- Hook ---

export function useUpdateEventMutation(props: UpdateEventMutationProps) {
  const { eventId } = props;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Kept outside mutationFn so onSuccess can reference it
  let resolvedFields: Record<string, any> = {};

  return useMutation({
    mutationFn: async () => {
      resolvedFields =
        props.mode === "direct" ? props.updatedFields : buildDiffFields(props);

      if (Object.keys(resolvedFields).length === 0) return;

      const { getFormData } = frmz(resolvedFields);
      const { data } = await authenticatedInstance.patch(
        `/event-partners/update-event/${eventId}`,
        getFormData(),
      );

      return data;
    },
    onSuccess: () => {
      if (Object.keys(resolvedFields).length === 0) return;

      toast.success("Event updated successfully", {
        id: "completed-event-edit",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("event-details") ||
          query.queryKey.includes("user-events"),
      });

      navigate({
        to: "/app/events/$id",
        params: {
          id: eventId,
        },
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
      console.error("Mutation error:", error);
    },
  });
}

// --- Diff helper ---

function buildDiffFields(props: DiffModeProps): Record<string, any> {
  const {
    event,
    name,
    description,
    category,
    subCategory,
    currency,
    privacy,
    photo,
    isOnlineEvent,
    startDate,
    endDate,
    startTime,
    endTime,
  } = props;

  const fields: Record<string, any> = {};

  if (name !== event.name) fields.name = name;
  if (description !== event.description) fields.description = description;
  if (privacy !== event.privacy) fields.privacy = privacy;
  if (currency && currency !== event.currency) fields.currency = currency;
  if (category.id !== event.category._id) fields.category = category.id;
  if (subCategory?.id) fields.subCategory = subCategory.id;

  if (!isOnlineEvent) {
    if (props.address !== event.address) fields.address = props.address;
    if (
      event.loc &&
      (props.latitude !== event.loc.coordinates[1] ||
        props.longitude !== event.loc.coordinates[0])
    ) {
      fields.latitude = props.latitude;
      fields.longitude = props.longitude;
    }
  }

  if (isOnlineEvent && props.meetingLink !== event.meetingLink) {
    fields.meetingLink = props.meetingLink;
  }

  const newStartISO = convertDateTimeInputToISOString(startDate, startTime);
  const newEndISO = convertDateTimeInputToISOString(endDate, endTime);

  if (
    event.endTime.split("T")[0] !== startDate ||
    startTime !== getTimeFromISO(event.endTime)
  ) {
    fields.endTime = newStartISO;
  }

  if (
    event.eventEndDate.split("T")[0] !== endDate ||
    endTime !== getTimeFromISO(event.eventEndDate)
  ) {
    fields.eventEndDate = newEndISO;
  }

  if (photo instanceof File) fields.photo = photo;

  return fields;
}
