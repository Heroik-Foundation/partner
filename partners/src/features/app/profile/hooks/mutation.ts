import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { frmz } from "frmz";
import { AxiosError } from "axios";

type Props = {
  name: string;
  eventsPerYear: string;
  telephone: string;
  address: string;
  logo: string | File;
  bio: string;
};

export function useUpdateUserDetailsMutation(props: Props) {
  const { logo, ...rest } = props;
  const queryClient = useQueryClient();

  const { getFormData } = frmz({
    ...rest,
  });

  return useMutation({
    mutationFn: async () => {
      const formData = getFormData();
      const response = await authenticatedInstance.patch(
        "/event-partners/edit-details",
        formData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Details updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error: AxiosError) => {
      if (
        error.response &&
        error.response.status >= 200 &&
        error.response.status < 300
      ) {
        toast.success("Details updated successfully!");
        queryClient.invalidateQueries({
          queryKey: ["user"],
        });
        return;
      }

      toast.error("Failed to update details.");
      console.error("Update error:", error);
    },
  });
}
