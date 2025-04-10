import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useEventPartnersLists() {
  return useQuery({
    queryKey: ["event-partners"],
    queryFn: async () => {
      const { data } = await api("/event-partners", {
        authenticated: true,
        admin: false,
        method: "GET",
      });

      return data;
    },
  });
}
