import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export type EventTicketProps = {
  ticketType: string;
  ticketPrice: number;
  signUpLimit: number;
  ticketDetails?: string;
  salesStartDate: string | null;
  salesEndDate: string | null;
  eventId: string;
};

export function useAddEventTicketMutation(props: EventTicketProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { eventId, ...rest } = props;
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/event-partners/add-ticket-type/${eventId}`,
        {
          ticketing: [
            {
              ...rest,
            },
          ],
        },
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Ticket Added Successfully");
      queryClient.invalidateQueries({
        queryKey: ["event-details"],
      });
      navigate({
        to: "/app/events/$id",
        params: {
          id: eventId,
        },
      });
    },
    onError: () => {
      toast.error("An error occured while adding your ticket");
    },
  });
}
