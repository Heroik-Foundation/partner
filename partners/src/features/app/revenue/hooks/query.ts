import { authenticatedInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Wallet } from "../../global/types";
import { useUserPropertiesQuery } from "../../global/hooks/query";
import { timeInMinutes } from "@/helpers/time";

export function useWalletDetailsQuery() {
  const { data } = useUserPropertiesQuery();
  const partnerId = data?._id;

  return useQuery({
    queryKey: ["user-wallet"],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get(
        `/event-partners/get-wallet/${partnerId}`
      );

      return data.wallet as Wallet;
    },
    staleTime: timeInMinutes(2),
  });
}

export function useTicketSalesStatsQuery() {
  const { data } = useUserPropertiesQuery();
  const userId = data?._id;
  return useQuery({
    queryKey: ["monthly-ticket-sales-stats", userId],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get(
        `/event-partners/ticket-sales-monthly-stats/${userId}`
      );

      return data.stats;
    },
  });
}
