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
      const { data } = await api("/signin", {
        authenticated: false,
        admin: true,
        method: "POST",
        data: {
          email: email,
          password: password,
        },
      });

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
