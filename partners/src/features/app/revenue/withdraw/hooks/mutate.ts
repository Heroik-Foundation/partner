import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useWithdrawalInitMutation({ amount }: { amount: number }) {
  const navigate = useNavigate();
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
      navigate({
        to: "/app/revenue/withdraw",
      });
    },
    onError: () => {
      toast.error("An error occured");
    },
  });
}
