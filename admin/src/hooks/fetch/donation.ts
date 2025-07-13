import { api } from "@/lib/axios";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export function useAllDonations() {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["all-platform-donations"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(
        `/donations/all-donation-history?page=${pageParam}`,
        {
          admin: false,
          authenticated: true,
        }
      );

      return data.donations;
    },
    getNextPageParam: (lastPage) => {
      const nextPage =
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.currentPage + 1
          : null;

      return nextPage;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => page.data),
    }),
    initialData: () => {
      const queryCacheData = queryClient.getQueryState([
        "all-platform-donations",
      ])?.data;
      if (queryCacheData) {
        return {
          pageParams: [undefined, 1],
          pages: [queryCacheData],
        };
      }
    },
    initialPageParam: 1,
  });
}
