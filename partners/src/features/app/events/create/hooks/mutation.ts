import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { frmz } from "@/lib/frmz";
import { useCurrencyStore } from "@/stores/currency";

type Ticket = {
  ticketType: string;
  ticketPrice: number;
  signUpLimit: number;
  salesStartDate: string;
  salesEndDate: string;
};

type CreateEventBase = {
  name: string;
  description: string;
  fundRaiser?: {
    fundRaisingGoal?: number;
    recipientCharities: string[]; // array of organization IDs
  };
  recurrence?: {
    interval: number;
    frequency: "WEEKLY" | "MONTHLY";
    daysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
    endType: "NEVER" | "UNTIL_DATE" | "AFTER_OCCURRENCES";
    endDate?: string;
    occurrenceCount?: number;
  };
  promoCode?: {
    discount: number;
    code: string;
  };
  ticketing?: Ticket[];
  category: string;
  subcategory?: string;
  privacy: string;
  eventEndDate: string;
  endTime: string;
  eventType?: string;
  communityId?: string;
  photo?: string | File;
  isRefundable: boolean;
};

export type CreateEventMutation = CreateEventBase &
  (
    | {
      address: string;
      latitude: number;
      longitude: number;
      meetingLink?: never;
    }
    | {
      meetingLink: string;
      address?: never;
      latitude?: never;
      longitude?: never;
    }
  );

export function useCreateEventMutation(props: CreateEventMutation) {
  const { selectedCurrency } = useCurrencyStore();
  const { subcategory, ...rest } = props;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const URL = rest.meetingLink
    ? "/event-partners/create-online-event"
    : "/event-partners/create-event";

  return useMutation({
    mutationFn: async () => {
      const { getFormData } = frmz({
        ...(subcategory !== undefined && { subcategory: subcategory }),
        currency: selectedCurrency.value,
        ...rest,
      });
      const formData = getFormData();

      const { data } = await authenticatedInstance.post(URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data;
    },
    onSuccess: (data: any) => {
      toast.success("Event created successfully");
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("user-events") ||
          query.queryKey.includes("event-details"),
      });

      const eventId =
        data?.event?._id ||
        data?.event?.id ||
        data?.data?.event?._id ||
        data?.data?.event?.id ||
        data?.data?._id ||
        data?._id ||
        data?.id;

      if (eventId) {
        navigate({
          to: "/app/events/$id/success",
          params: {
            id: String(eventId),
          },
        });
      } else {
        navigate({
          to: "/app",
        });
      }
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
      console.error("Mutation error:", error);
    },
  });
}
