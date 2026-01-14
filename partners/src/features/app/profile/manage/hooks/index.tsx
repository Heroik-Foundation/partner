import { baseInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

import { addSession } from "@/lib/session";
import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";

type AddSessionResponse = {
  eventPartner: {
    name: string;
    email: string;
  };
  token: string;
};

export function useAddSessionMutation() {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await baseInstance.post<AddSessionResponse>(
        "/event-partners/login",
        credentials
      );

      return data;
    },
    onSuccess: (data) => {
      const { token, eventPartner } = data;

      addSession({
        sessionToken: token,
        name: eventPartner.name,
        email: eventPartner.email,
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
