import { authenticatedInstance } from "@/lib/axios";
import { NestedPaginatedResponse, Notification } from "../../global/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { timeInMinutes } from "@/helpers/time";

export function useUserNotificationsQuery() {
  return useInfiniteQuery({
    queryKey: ["user-notifications-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Notification, "notifications">
      >("/notifications", {
        params: {
          page: pageParam,
        },
      });
      return data;
    },

    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.notifications.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.notifications;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
