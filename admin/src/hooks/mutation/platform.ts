import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useAppVersionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["app-version-mutation"],
    mutationFn: async () => {
      const { data } = await api.get(`/users/`, {
        authenticated: true,
        admin: false,
      });

      return data;
    },
    onError: (error: AxiosError) => {
      console.log(error);
      toast.error("An error occured");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["app-version"],
      });
      toast.success("Version set successfully");
    },
  });
}

export function useSetAppMutation({
  payload,
}: {
  payload: {
    platform: "ios" | "android";
    version: string;
    logs: string[];
    currentVersion: string;
  };
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["app-version-mutation"],
    mutationFn: async () => {
      const { data } = await api.post(`/users/set-app-version`, {
        authenticated: true,
        admin: false,
        data: {
          currentVersion: payload.version,
          minStableVersion: payload.currentVersion,
          platform: payload.platform,
          features: payload.logs,
        },
      });

      return data;
    },
    onError: (error: AxiosError) => {
      //@ts-ignore
      toast.error(error.response?.data.error.details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["app-version"],
      });
      toast.success("Log created successfully");
    },
  });
}
