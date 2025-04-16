import {
  NestedPaginatedResponse,
  ScannedTicket,
} from "@/features/app/global/types";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

type QueryProps = {
  searchQuery?: string;
};

export function useUserScannedTicketsQuery(props: QueryProps) {
  const { searchQuery } = props;

  return useInfiniteQuery({
    queryKey: ["user-events", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<ScannedTicket, "result">
      >(`/events/ticket-scan-logs`, {
        params: {
          page: pageParam,
          searchQuery,
        },
      });
      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.result.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.result;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
