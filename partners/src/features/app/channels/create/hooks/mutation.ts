import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

type CreateChannelMutationProps = {
  name: string;
  description: string;
  photo: File | null;
};

type CreatePostMutationProps = {
  content: string;
  id?: string;
  isAnnouncement: boolean;
  file?: File;
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
  const formData = new FormData();

  const { content, id, isAnnouncement, file } = props;

  formData.append("content", content);
  formData.append("communityId", String(id));
  formData.append("isAnnouncement", String(isAnnouncement));
  if (file) {
    formData.append("attachment", file);
  }

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post("/posts", formData);

      return data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({
        queryKey: ["channel-posts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["channel-announcements"],
      });
      history.back();
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
