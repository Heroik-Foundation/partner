import { api } from "@/lib/axios";
import { setSessionToken } from "@/helpers/session";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ISignIn {
  email: string;
  password: string;
}

export function useSignIn({ email, password }: ISignIn) {
  const { navigate } = useRouter();
  return useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async () => {
      const { data } = await api.post(
        "/signin",
        {
          email: email,
          password: password,
        },
        {
          authenticated: false,
          admin: true,
        }
      );

      setSessionToken(data.token);

      return data;
    },
    onSuccess: () => {
      toast.success("Welcome back");
      navigate({
        to: "/dashboard",
      });
    },
    onError: (error: AxiosError) => {
      console.log(error);
      //@ts-ignore
      toast.error(error.response?.data.error.details.message);
    },
  });
}
