import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useEventTerminationByIDMutation({
  id,
  shouldRefund,
}: {
  id: string;
  shouldRefund: boolean;
}) {
  const { navigate } = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/event-partners/cancel-event/${id}`,
        {
          shouldRefund,
        },
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      navigate({
        to: "/app/events",
      });
    },
    onError: (error) => {
      console.log("An error occured", error);
      toast.error("An error occured");
    },
  });
}
