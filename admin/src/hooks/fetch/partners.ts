import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export function useEventPartnersLists() {
  return useQuery({
    queryKey: ["event-partners"],
    queryFn: async () => {
      const { data } = await api.get("/event-partners", {
        authenticated: true,
        admin: false,
      });

      return data;
    },
  });
}
