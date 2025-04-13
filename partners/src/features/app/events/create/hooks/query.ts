import { Category, NestedPaginatedResponse } from "@/features/app/global/types";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useEventCategoriesQuery() {
  return useInfiniteQuery({
    queryKey: ["user-event-categories"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Category, "categories">
      >(`/core/categories`, {
        params: {
          page: pageParam,
        },
      });
      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.categories.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.categories;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
