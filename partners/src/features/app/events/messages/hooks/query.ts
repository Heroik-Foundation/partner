import { Message } from "@/features/app/global/types";

import { authenticatedInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type ConversationMessagesQueryProps = {
  conversationId?: string;
};

export function useConversationMessagesQuery({
  conversationId,
}: ConversationMessagesQueryProps) {
  return useQuery({
    queryKey: ["conversation-messages-by-id", conversationId],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get(
        `/conversations/${conversationId}/messages`
      );

      return data.messages.data as Message[];
    },
  });
}
