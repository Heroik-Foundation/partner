import { authenticatedInstance } from "@/lib/axios";
import { useCurrencyStore } from "@/stores/currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useWithdrawalInitMutation({ amount }: { amount: number }) {
  const queryClient = useQueryClient();

  const { selectedCurrency } = useCurrencyStore();

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        "/event-partners/withdraw-funds",
        {
          amount: amount,
          currency: selectedCurrency.value,
        },
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Withdrawal successful");

      queryClient.invalidateQueries({
        queryKey: ["user-wallet"],
      });

      queryClient.invalidateQueries({
        queryKey: ["user-wallet", selectedCurrency.value],
      });
    },
    onError: () => {
      toast.error("An error occured");
    },
  });
}
