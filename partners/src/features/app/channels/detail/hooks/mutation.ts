import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useDeletePostMutation({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.delete(`/posts/${id}`);

      return data;
    },
    onSuccess: () => {
      toast.success("Post deleted");
      queryClient.invalidateQueries({
        queryKey: ["channel-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["channel-announcements"],
      });
    },
    onError: () => {
      toast.error("An error occured, please try again");
    },
  });
}

export function useFlagPostMutation({ id }: { id: string }) {
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(`/posts/${id}/report`, {
        reason: "The creator of this channel has flagged this post",
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Post flagged");
    },
    onError: () => {
      toast.error("An error occured, please try again");
    },
  });
}

export function usePostToAnnouncementMutation({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/event-partners/posts/${id}/make-announcement`
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Post is now an announcement");
      queryClient.invalidateQueries({
        queryKey: ["channel-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["channel-announcements"],
      });
    },
    onError: () => {
      toast.error("An error occured, please try again");
    },
  });
}
