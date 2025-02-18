import { baseInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ErrorResponse,
  handleUserResponseToError,
} from "../../../../helpers/error";

export function useSignUpMutation() {
  const { form } = useAuthStore();
  const { navigate } = useRouter();
  const formData = new FormData();

  formData.append("name", form.name);
  formData.append("address", form.address);
  formData.append("email", form.email);
  formData.append("telephone", String(form.number));
  formData.append("eventsPerYear", String(form.events));

  if (form.image) {
    formData.append("logo", form.image);
  }
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
