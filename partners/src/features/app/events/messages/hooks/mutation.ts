import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type Props = {
  conversationId: string;
  message: string;
  replying: string;
};

export function useConversationMessageInitMutation(props: Props) {
  const { invalidateQueries } = useQueryClient();
  const { conversationId, ...rest } = props;
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/conversations/${conversationId}/messages`,
        { ...rest }
      );

      return data;
    },
    onSuccess: () => {
      invalidateQueries({
        queryKey: ["conversation-messages-by-id"],
      });
    },
    onError: (error: AxiosError) => {
      console.log(error);
      invalidateQueries({
        queryKey: ["conversation-messages-by-id"],
      });
    },
  });
}
