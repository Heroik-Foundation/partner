import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAddChannelModeratorMutation({
  userId,
  id,
  username,
}: {
  userId: string;
  id: string;
  username: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/communities/add-moderator/${id}`,
        {
          members: [userId],
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success(`${username} is now a moderator`);
      queryClient.invalidateQueries({
        queryKey: ["channel-moderators-list"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occured");
    },
  });
}

export function useRemoveChannelModeratorMutation({
  userId,
  id,
  username,
}: {
  userId: string;
  id: string;
  username: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await authenticatedInstance.post(
        `/communities/remove-moderator/${id}`,
        {
          moderatorId: userId,
        }
      );

      return data;
    },
    onSuccess: () => {
      toast.success(`${username} is no longer a moderator`);
      queryClient.invalidateQueries({
        queryKey: ["channel-moderators-list"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occured");
    },
  });
}
