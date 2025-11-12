import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useWithdrawalInitMutation({ amount }: { amount: number }) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        "/event-partners/withdraw-funds",
        {
          amount,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Withdrawal successful");
    },
    onError: () => {
      toast.error("An error occured");
    },
  });
}
