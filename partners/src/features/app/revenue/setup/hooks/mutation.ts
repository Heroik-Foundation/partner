import { authenticatedInstance } from "@/lib/axios";
import { useCurrencyStore } from "@/stores/currency";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

// type UpdateBankDetailsMutationProps = {
//   bankAccountName: string;
//   bankAccountNumber: string;
//   bankName: string;
//   sortCode: string;
//   pin: string;
// };

type UpdateSecurityPinMutationProps = {
  newPin: string;
  oldPin?: string;
};

export function useUpdateBankDetailsMutation() {
  const { navigate } = useRouter();
  const { selectedCurrency } = useCurrencyStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: any) => {
      const { data } = await authenticatedInstance.patch(
        `/event-partners/update-bank-details/${selectedCurrency.value}`,
        {
          ...props,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Details updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["user-wallet-by-currency"],
      });
      navigate({
        to: "/app/revenue/setup-pin",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occured, please try again");
    },
  });
}

export function useUpdateSecurityPinMutation() {
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async (props: UpdateSecurityPinMutationProps) => {
      const { data } = await authenticatedInstance.patch(
        "/event-partners/update-pin",
        {
          ...props,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Security pin updated successfully");
      navigate({
        to: "/app/revenue",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occured, please try again");
    },
  });
}
