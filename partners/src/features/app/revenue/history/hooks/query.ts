import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useTicketSalesListQuery() {
  return useInfiniteQuery({
    queryKey: ["ticket-sales-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get(
        "/events/admin-ticket-sales",
        {
          params: {
            page: pageParam,
          },
        }
      );

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages[0].result.data.flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.result;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}

export function useWithdrawalLogsListQuery() {
  const { data } = useUserPropertiesQuery();
  const userId = data?._id;

  return useInfiniteQuery({
    queryKey: ["withdrawal-logs-list", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get(
        `/event-partners/withdrawal-logs/${userId}`,
        {
          params: {
            page: pageParam,
          },
        }
      );

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages[0].logs.data.flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.logs;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
