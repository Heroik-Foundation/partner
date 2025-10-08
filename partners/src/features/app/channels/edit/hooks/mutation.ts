import { ErrorResponse, handleUserResponseToError } from "@/helpers/error";
import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { frmz } from "frmz";

type EditChannelMutationProps = {
  id?: string;
  name: string;
  description: string;
  photo: File | null;
  isPrivateCommunity?: boolean;
};

export function useEditChannelMutation(props: EditChannelMutationProps) {
  const queryClient = useQueryClient();
  const { name, description, photo, id } = props;

  const { getFormData } = frmz({ name, description, ...(photo && photo) });

  const formData = getFormData();

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
