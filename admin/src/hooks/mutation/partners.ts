import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export function useEventPartnerVerificationInit() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await api(`/verify-event-partner/${id}`, {
        admin: true,
        authenticated: true,
        method: "POST",
      });

      return data;
    },
  });
}
