import { NestedPaginatedResponse } from "@/features/categories/hooks/query";
import { timeInMinutes } from "@/helpers/date-time";
import { api } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export type EventPartner = {
  _id: string;
  name: string;
  logo: string;
  address: string;
  email: string;
  telephone: string;
  pinSet: boolean;
  eventsPerYear: number;
  isVerified: boolean;
  accountClaimed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type DataReturnType = NestedPaginatedResponse<EventPartner, "data">;

export function useEventPartnersQuery() {
  return useInfiniteQuery({
    queryKey: ["event-partners-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<DataReturnType>(`/event-partners`, {
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
      pages: pages.map((page) => page.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.data;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
