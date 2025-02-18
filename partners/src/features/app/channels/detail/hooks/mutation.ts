import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreatePostReactionMutation = {
  id?: string;
  onError?: () => void;
};

export function useCreatePostLikeMutation(props: CreatePostReactionMutation) {
  const { id, onError } = props;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(`/posts/${id}/like`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel-posts"],
      });
    },
    onError,
  });
}

export function useCreatePostDislikeMutation(
  props: CreatePostReactionMutation
) {
  const { id, onError } = props;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(`/posts/${id}/unlike`);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel-posts"],
      });
    },
    onError,
  });
}
