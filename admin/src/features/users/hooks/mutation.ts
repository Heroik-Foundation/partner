import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateUserNotificationInitMutation() {
  return useMutation({
    mutationFn: async ({
      ...props
    }: {
      recipient: string;
      message: string;
      title: string;
    }) => {
      const { data } = await api.post("/send-notification", {
        ...props,
      });

      return data;
    },
    onSuccess: () => {
      toast.success("Notification sent to user");
    },
    onError: () => {
      toast.error("Failed to send notification to user");
    },
  });
}
