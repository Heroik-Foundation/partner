import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

export function useEventPartnerVerificationInit() {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await api.post(`/verify-event-partner/${id}`, {
        admin: true,
        authenticated: true,
      });

      return data;
    },
  });
}
