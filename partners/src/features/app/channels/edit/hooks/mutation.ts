import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type EditChannelMutationProps = {
  id?: string;
  name: string;
  description: string;
  photo: File | null;
  isPrivateCommunity: boolean;
};

export function useEditChannelMutation(props: EditChannelMutationProps) {
  const queryClient = useQueryClient();
  const { name, description, photo, id, isPrivateCommunity } = props;
  const formData = new FormData();

  formData.append("name", name);
  formData.append("description", description);
  formData.append("privacy", isPrivateCommunity ? "invite-only" : "public");

  if (photo) {
    formData.append("photo", photo);
  }

  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.patch(
        `/event-partners/edit-community/${id}`,
        formData
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Channel updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["channel-detail"],
      });
    },
    onError: (error: ErrorResponse) => {
      handleUserResponseToError(error);
    },
  });
}
