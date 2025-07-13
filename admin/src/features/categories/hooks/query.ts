import { timeInMinutes } from "@/helpers/date-time";
import { api } from "@/lib/axios";

import { useInfiniteQuery } from "@tanstack/react-query";

export type Category = {
  _id: string;
  image: string;
  name: string;
  subcategories: {
    _id: string;
    image: string;
    name: string;
  }[];
};

type NestedPaginatedResponse<T, K extends string = "name"> = {
  [key in K]: {
    currentPage: number;
    data: T[];
    totalCount: number;
    totalPages: number;
  };
};

export function useEventCategoriesQuery() {
  return useInfiniteQuery({
    queryKey: ["user-event-categories"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<
        NestedPaginatedResponse<Category, "categories">
      >(`/core/categories`, {
        authenticated: true,
        admin: false,

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
