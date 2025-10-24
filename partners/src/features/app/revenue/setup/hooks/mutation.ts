import { authenticatedInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

type UpdateBankDetailsMutationProps = {
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  sortCode: string;
  pin: string;
};

type UpdateSecurityPinMutationProps = {
  newPin: string;
  oldPin?: string;
};

export function useUpdateBankDetailsMutation(
  props: UpdateBankDetailsMutationProps
) {
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.patch(
        "/event-partners/update-bank-details",
        {
          ...props,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Details updated successfully");
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
