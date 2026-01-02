import { authenticatedInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Wallet } from "../../global/types";
import { useUserPropertiesQuery } from "../../global/hooks/query";
import { timeInMinutes } from "@/helpers/time";
import { useCurrencyStore } from "@/stores/currency";

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

export function useWalletDetailsByCurrencyQuery() {
  const { selectedCurrency } = useCurrencyStore();
  const { data } = useUserPropertiesQuery();
  const partnerId = data?._id;

  return useQuery({
    queryKey: ["user-wallet-by-currency", selectedCurrency.value],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get(
        `/event-partners/get-wallet/${partnerId}/${selectedCurrency.value}`
      );

      return data.wallet as Wallet;
    },
    staleTime: timeInMinutes(30),
    enabled: partnerId !== undefined,
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
