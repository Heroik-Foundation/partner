import { Event } from "@/features/app/global/types";
import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { frmz } from "frmz";
import { useCurrencyStore } from "@/stores/currency";

type Ticket = {
  ticketType: string;
  ticketPrice: number;
  signUpLimit: number;
  salesStartDate: string; // ISO date string
  salesEndDate: string; // ISO date string
};

type CreateEventMutation = {
  name: string;
  description: string;
  fundRaiser?: {
    fundRaisingGoal: number;
    organizations: string[]; // array of organization IDs
  };
  recurrence?: {
    interval: number;
    frequency: "WEEKLY" | "MONTHLY"; // could extend with more if needed
    daysOfWeek: number[]; // 0 = Sunday, 6 = Saturday
    endType: "NEVER" | "UNTIL_DATE" | "AFTER_OCCURRENCES";
    endDate?: string; // only if endType is UNTIL_DATE
    occurrenceCount?: number; // only if endType is AFTER_OCCURRENCES
  };
  ticketing?: Ticket[];
  category: string;
  subcategory?: string;
  privacy: string;
  eventEndDate: string;
  endTime: string;
  address: string;
  latitude: number;
  longitude: number;
  communityId?: string;
  photo?: string | File;
};

export function useCreateEventMutation(props: CreateEventMutation) {
  const { selectedCurrency } = useCurrencyStore();
  const { subcategory, ...rest } = props;
  const { navigate } = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { getFormData } = frmz({
        ...(subcategory !== undefined && { subcategory: subcategory }),
        currency: selectedCurrency.value,
        ...rest,
      });
      const formData = getFormData();

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
