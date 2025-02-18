import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";

export function useEventDeleteMutation({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { navigate } = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api(`/events/${id}`, {
        admin: false,
        authenticated: true,
        method: "DELETE",
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["all-events"],
      });
      toast.success("Event deleted successfully");
      navigate({
        to: "/dashboard/events",
      });
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("An error occured");
    },
  });
}
