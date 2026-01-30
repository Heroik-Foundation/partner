import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { baseInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useRecoveryValidationMutation() {
  const { form, resetForm } = useAuthStore();
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await baseInstance.post(
        "/event-partners/password-reset",
        {
          resetCode: form.code,
          password: form.password.trim(),
          email: form.email.trim(),
        },
      );

      return data;
    },
    onSuccess: () => {
      resetForm();
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
