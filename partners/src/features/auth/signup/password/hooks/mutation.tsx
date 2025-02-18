import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { baseInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

export function useOTPValidationMutation() {
  const { form, resetForm } = useAuthStore();
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await baseInstance.post("/event-partners/verify", {
        verificationCode: form.code,
        password: form.password,
        email: form.email,
      });

      return data;
    },
    onSuccess: () => {
      resetForm();
      navigate({
        to: "/app",
      });
      toast.success("Account verified successfully");
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
