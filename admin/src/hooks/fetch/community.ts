import { api } from "@/lib/axios";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

export function useAllCommunities() {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["community"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(`/communities?page=${pageParam}`, {
        method: "GET",
        admin: true,
        authenticated: true,
      });

      return data.communities;
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
      const queryCacheData = queryClient.getQueryState(["community"])?.data;
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


