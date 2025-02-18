import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateCommentReactionMutation = {
  id?: string;
  onError?: () => void;
};

type CreatCommentMutation = {
  content: string;
  id?: string;
};

export function useCreateCommentLikeMutation(
  props: CreateCommentReactionMutation
) {
  const { id, onError } = props;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/posts/comments/${id}/like`
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments"],
      });
    },
    onError,
  });
}

export function useCreateCommentDislikeMutation(
  props: CreateCommentReactionMutation
) {
  const { id, onError } = props;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/posts/comments/${id}/unlike`
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments"],
      });
    },
    onError,
  });
}

export function useCreateCommentMutation(props: CreatCommentMutation) {
  const { content, id } = props;
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/posts/${id}/comment`,
        {
          content,
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["post-comments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["channel-posts"],
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
