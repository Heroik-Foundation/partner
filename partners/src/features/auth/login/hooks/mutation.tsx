import { baseInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  handleUserResponseToError,
  ErrorResponse,
} from "../../../../helpers/error";
import { setTokens } from "@/lib/session";

type LoginMutationResponse = {
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
    eventsPerYear: 0;
  };
  token: "string";
};

export function useLoginMutation() {
  const { form, resetForm } = useAuthStore();
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async () => {
      const { data } = await baseInstance.post<LoginMutationResponse>(
        "/event-partners/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      return data;
    },
    onSuccess: (data) => {
      setTokens(data.token);
      resetForm();
      toast.success("Login successful");
      navigate({
        to: "/app",
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
