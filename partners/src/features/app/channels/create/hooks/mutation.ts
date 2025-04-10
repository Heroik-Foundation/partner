import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAnnouncementStore } from "../../hooks/store/post";

type CreateChannelMutationProps = {
  name: string;
  description: string;
  photo: File | null;
};

type CreatePostMutationProps = {
  content: string;
  id?: string;
};

export function useCreateChannelMutation(props: CreateChannelMutationProps) {
  const { name, description, photo } = props;
  const formData = new FormData();
  const { navigate } = useRouter();

  if (photo) {
    formData.append("name", name);
    formData.append("description", description);
    formData.append("photo", photo);
    formData.append("privacy", "public");
  }

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        "/event-partners/create-community",
        formData
      );

      return data;
    },
    onSuccess: (data) => {
      navigate({
        to: "/app/channels/$id",
        params: {
          id: data.community._id,
        },
      });
      toast.success("Channel created successfully");
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}

export function useCreatePostMutation(props: CreatePostMutationProps) {
  const { history } = useRouter();
  const queryClient = useQueryClient();
  const { isAnnouncement } = useAnnouncementStore();
  const { content, id } = props;
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post("/posts", {
        content,
        communityId: id,
        isAnnouncement,
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({
        queryKey: ["channel-posts"],
      });
      history.back();
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
