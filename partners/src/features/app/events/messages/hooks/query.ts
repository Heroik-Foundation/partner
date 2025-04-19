import {
  Conversation,
  Message,
  NestedPaginatedResponse,
} from "@/features/app/global/types";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type ConversationQueryProps = {
  searchQuery?: string;
  eventId?: string;
};

type ConversationMessagesQueryProps = {
  conversationId?: string;
};

export function useConversationsQuery(props: ConversationQueryProps) {
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

export function useConversationMessagesQuery({
  conversationId,
}: ConversationMessagesQueryProps) {
  return useQuery({
    queryKey: ["conversation-messages-by-id", conversationId],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get(
        `/conversations/${conversationId}/messages`
      );

      return data.message as Message[];
    },
  });
}
