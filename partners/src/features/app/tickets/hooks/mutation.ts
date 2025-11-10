import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useUserEventTicketVerificationMutation() {
  const { navigate } = useRouter();
  return useMutation({
    mutationFn: async ({ eventTicketId }: { eventTicketId: string }) => {
      const { data } = await authenticatedInstance.post(
        `/events/user-event-ticket-verification/${eventTicketId}`
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Ticket Verified", {
        id: "valid-qr-code",
      });
      navigate({
        to: "/app/tickets/history",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Invalid Ticket QR Code", {
        id: "invalid-ticket-qr-code",
      });
    },
  });
}
