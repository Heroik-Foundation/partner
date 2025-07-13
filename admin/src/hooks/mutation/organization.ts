import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "@tanstack/react-router";
import { AxiosError } from "axios";

export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();
  const { navigate } = useRouter();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post("/organizations", formData, {
        authenticated: true,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations-list"],
      });
      toast.success("Organization created successfully");
      navigate({
        to: "/dashboard/charities",
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("An error occured");
    },
  });
}

export function useEditOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["edit-organization-details"],
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const { data } = await api.patch(`/organizations/${id}`, formData, {
        authenticated: true,
        admin: true,
      });

      return data;
    },
    onSuccess: async () => {
      toast.success("Details updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["organization"],
      });
    },
    onError: async (error: AxiosError) => {
      if (typeof error.message !== undefined) {
        toast.error(error.message);
        return;
      }
      toast.error("An error occured");
    },
  });
}
