import {
  Conversation,
  NestedPaginatedResponse,
} from "@/features/app/global/types";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

type QueryProps = {
  searchQuery?: string;
  eventId?: string;
};

export function useConversationsQuery(props: QueryProps) {
  const { eventId, searchQuery } = props;

  return useInfiniteQuery({
    queryKey: ["user-events", searchQuery, eventId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Conversation, "conversations">
      >("/conversations", {
        params: {
          page: pageParam,
          searchQuery,
          event: eventId,
        },
      });
      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.conversations.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.conversations;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
