import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useEventTerminationByIDMutation({
  id,
  refundType,
}: {
  id: string;
  refundType: "payment" | "voucher";
}) {
  const { navigate } = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.delete(`/events/${id}`, {
        data: {
          refundType,
        },
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Event deleted successfully");
      navigate({
        to: "/app",
      });
    },
    onError: (error) => {
      console.log("An error occured", error);
      toast.error("An error occured");
    },
  });
}
