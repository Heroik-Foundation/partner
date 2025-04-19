import { authenticatedInstance } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type Props = {
  name: string;
  eventsPerYear: string;
  telephone: string;
  address: string;
  logo: string | File;
};

export function useUpdateUserDetailsMutation(props: Props) {
  const { name, eventsPerYear, telephone, address } = props;
  const { invalidateQueries } = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("eventsPerYear", eventsPerYear);
      formData.append("telephone", telephone);
      formData.append("address", address);
      //   formData.append("logo", logo);

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
