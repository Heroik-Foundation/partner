import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
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

export function useUpdateBankDetailsMutation(callback?: () => void) {
  const { selectedCurrency } = useCurrencyStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: any) => {
      const { data } = await authenticatedInstance.patch(
        `/event-partners/${selectedCurrency.value}/update-bank-details/`,
        {
          ...props,
        },
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Details updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["user-wallet"],
      });

      if (callback) {
        callback();
      }
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
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
        },
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Security pin updated successfully");
      navigate({
        to: "/app/revenue",
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
