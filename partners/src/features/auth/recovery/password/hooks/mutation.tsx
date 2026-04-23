import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { baseInstance } from "@/lib/axios";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

type Props = {
  resetCode: string;
  password: string;
  email: string;
};

export function useRecoveryValidationMutation() {
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async (props: Props) => {
      const { data } = await baseInstance.post(
        "/event-partners/password-reset",
        {
          ...props,
        },
      );

      return data;
    },
    onSuccess: () => {
      navigate({
        to: "/auth/login",
      });
      toast.success("Password reset successfully");
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
