import { baseInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleUserResponseToError,
} from "../../../../helpers/error";
import { useAuthStore } from "@/stores/auth";

export function useRecoveryMutation() {
  const { navigate } = useRouter();
  const { form } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const { data } = await baseInstance.post(
        "/event-partners/password-reset-request",
        {
          email: form.email,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Password reset link has been sent to your email");
      navigate({
        to: "/auth/recovery/success",
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
