import { baseInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  handleUserResponseToError,
  ErrorResponse,
} from "../../../../helpers/error";
import { addSession } from "@/lib/session";

type LoginResponse = {
  eventPartner: {
    name: string;
    logo: string;
    address: string;
    email: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    sortCode: string;
    telephone: string;
    eventsPerYear: number;
  };
  token: string;
};

export function useLoginMutation() {
  const { form, resetForm } = useAuthStore();
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await baseInstance.post<LoginResponse>(
        "/event-partners/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      return data;
    },
    onSuccess: (data) => {
      const { token, eventPartner } = data;

      addSession({
        sessionToken: token,
        name: eventPartner.name,
        email: eventPartner.email,
        photoUrl: eventPartner.logo,
      });

      resetForm();
      toast.success("Login successful");
      navigate({ to: "/app" });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
