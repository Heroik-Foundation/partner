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
  isRefundable?: boolean;
  absorbFees?: boolean;
};

// Diff mode — compares against original event
type DiffModeProps = EventCoreFields &
  EventDateTimeFields &
  EventLocation & {
    mode: "diff";
    event?: Event | null;
  };

// Direct mode — pass only the fields you want to update
type DirectModeProps = {
  mode: "direct";
  updatedFields: Record<string, any>;
};

type UpdateEventMutationProps = (DiffModeProps | DirectModeProps) & {
  eventId?: string;
};

// --- Hook ---

export function useUpdateEventMutation(props: UpdateEventMutationProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const targetEventId =
        props.eventId ||
        (props as any).id ||
        (props.mode === "diff" ? props.event?._id : undefined);

      if (!targetEventId) {
        throw new Error("Event ID is required to update event");
      }

      const resolvedFields =
        props.mode === "direct" ? props.updatedFields : buildDiffFields(props);

      if (Object.keys(resolvedFields).length === 0) return;

      const { getFormData } = frmz(resolvedFields);
      const { data } = await authenticatedInstance.patch(
        `/event-partners/update-event/${targetEventId}`,
        getFormData(),
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Event updated successfully", {
        id: "completed-event-edit",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("event-details") ||
          query.queryKey.includes("user-events"),
      });

      const targetEventId =
        props.eventId ||
        (props as any).id ||
        (props.mode === "diff" ? props.event?._id : undefined);

      if (targetEventId) {
        navigate({
          to: "/app/events/$id",
          params: {
            id: targetEventId,
          },
        });
      }
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
    isRefundable,
    absorbFees,
  } = props;

  const fields: Record<string, any> = {};

  if (!event) return fields;

  if (name !== undefined && name !== event.name) fields.name = name;
  if (description !== undefined && description !== event.description) fields.description = description;
  if (privacy !== undefined && privacy !== event.privacy) fields.privacy = privacy;
  if (currency && currency !== event.currency) fields.currency = currency;
  if (category?.id && category.id !== (event.category?._id || (event.category as any)?.id)) {
    fields.category = category.id;
  }
  const currentSubcategoryId =
    event.subcategory?._id ||
    event.subCategory?._id ||
    (event.subcategory as any)?.id ||
    (event.subCategory as any)?.id;
  if (subCategory?.id && subCategory.id !== currentSubcategoryId) {
    fields.subcategory = subCategory.id;
  }
  if (isRefundable !== undefined && isRefundable !== event.isRefundable) {
    fields.isRefundable = isRefundable;
  }
  if (absorbFees !== undefined && absorbFees !== event.absorbFees) {
    fields.absorbFees = absorbFees;
  }

  if (!isOnlineEvent) {
    if (props.address !== undefined && props.address !== event.address) {
      fields.address = props.address;
    }
    if (
      event.loc &&
      props.latitude !== undefined &&
      props.longitude !== undefined &&
      (props.latitude !== event.loc.coordinates[1] ||
        props.longitude !== event.loc.coordinates[0])
    ) {
      fields.latitude = props.latitude;
      fields.longitude = props.longitude;
    }
  }

  if (isOnlineEvent && props.meetingLink !== undefined && props.meetingLink !== event.meetingLink) {
    fields.meetingLink = props.meetingLink;
  }

  if (startDate && startTime && event.endTime) {
    const eventStartDate = event.endTime.split("T")[0];
    const eventStartTime = getTimeFromISO(event.endTime);
    if (eventStartDate !== startDate || eventStartTime !== startTime) {
      fields.endTime = convertDateTimeInputToISOString(startDate, startTime);
    }
  }

  if (endDate && endTime && event.eventEndDate) {
    const eventEndDate = event.eventEndDate.split("T")[0];
    const eventEndTime = getTimeFromISO(event.eventEndDate);
    if (eventEndDate !== endDate || eventEndTime !== endTime) {
      fields.eventEndDate = convertDateTimeInputToISOString(endDate, endTime);
    }
  }

  if (photo instanceof File) fields.photo = photo;

  return fields;
}
