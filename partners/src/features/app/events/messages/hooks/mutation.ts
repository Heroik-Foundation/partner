import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type Props = {
  conversationId: string;
  message: string;
  replying?: string;
};

export function useConversationMessageInitMutation(props: Props) {
  const queryClient = useQueryClient();
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
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages-by-id"],
      });
    },
    onError: (error: AxiosError) => {
      console.log(error);
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages-by-id"],
      });
    },
  });
}
