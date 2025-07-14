import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useVerifyPartnerMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await api.post(`/verify-event-partner/${id}`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-partners-list"],
      });
      toast.success("Verfied");
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-partners-list"],
      });
      toast.error("An error occured while verifying partner");
    },
  });
}
