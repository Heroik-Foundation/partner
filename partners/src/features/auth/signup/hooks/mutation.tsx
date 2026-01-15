import { baseInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleUserResponseToError,
} from "../../../../helpers/error";
import { frmz } from "frmz";

export function useSignUpMutation() {
  const { form } = useAuthStore();
  const { navigate } = useRouter();

  const { getFormData } = frmz({
    name: form.name,
    address: form.address,
    email: form.email.trim(),
    telephone: form.number,
    eventsPerYear: form.events,
    bio: form.bio,
    ...(form.image !== null && {
      logo: form.image,
    }),
  });

  const formData = getFormData();

  return useMutation({
    mutationFn: async () => {
      const { data } = await baseInstance.post(
        "/event-partners/create-account",
        formData
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      navigate({
        to: "/auth/signup/success",
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
