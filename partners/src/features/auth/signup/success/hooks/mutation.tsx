import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { baseInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useResendVerificationMutation() {
  const { form } = useAuthStore();
  return useMutation({
    mutationFn: async () => {
      const { data } = await baseInstance.post(
        "/event-partners/resend-verification-link",
        {
          email: form.email,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Verification link resent successfully");
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
