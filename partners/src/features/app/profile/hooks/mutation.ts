import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { frmz } from "frmz";

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
  const { invalidateQueries } = useQueryClient();

  const { getFormData } = frmz({
    ...rest,
  });

  return useMutation({
    mutationFn: async () => {
      const formData = getFormData();

      const { data } = await authenticatedInstance.patch(
        "/event-partners/edit-details",
        formData
      );

      return data;
    },
    onSuccess: () => {
      toast.success("Details updated successfully!");
      invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (error) => {
      toast.error("Failed to update details.");
      console.error("Update error:", error);
    },
  });
}
