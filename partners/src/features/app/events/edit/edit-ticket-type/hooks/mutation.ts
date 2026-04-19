import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type EventTicketProps = {
  ticketType: string;
  ticketPrice: number;
  signUpLimit: number;
  salesStartDate: string | null;
  salesEndDate: string | null;
  eventId: string;
  ticketTypeId: string;
};

export function useEditEventTicketMutation(props: EventTicketProps) {
  const queryClient = useQueryClient();
  const { eventId, ticketTypeId, ...rest } = props;
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.patch(
        `/event-partners/update-event-ticket-type/${eventId}/${ticketTypeId}`,
        {
          ...rest,
        },
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Ticket Update Successfully");
      queryClient.invalidateQueries({
        queryKey: ["event-details", eventId],
      });
    },
    onError: () => {
      toast.error("An error occured while editing your event");
    },
  });
}
