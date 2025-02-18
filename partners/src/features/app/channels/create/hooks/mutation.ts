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
};

export function useCreateChannelMutation(props: CreateChannelMutationProps) {
  const { name, description, photo } = props;
  const formData = new FormData();

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
    onSuccess: () => {
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
  const { content, id } = props;
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post("/posts", {
        content,
        communityId: id,
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
