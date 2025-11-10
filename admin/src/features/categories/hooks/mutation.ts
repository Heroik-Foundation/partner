import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Category } from "./query";
import { toast } from "sonner";

export function useCreateCategoryInitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, image }: { name: string; image: File }) => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("image", image);

      const { data } = await api.post<Category>("/categories", formData);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      toast.success("Category created successfully");
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      toast.error("An error occured while creating category");
    },
  });
}

export function useEditCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      image,
      categoryId,
    }: {
      name: string;
      image: File | null;
      categoryId: string;
    }) => {
      const formData = new FormData();

      formData.append("name", name);

      if (image) {
        formData.append("photo", image);
      }

      const { data } = await api.patch<Category>(
        `/categories/${categoryId}`,
        formData
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      toast.success("Category edited successfully");
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      toast.error("An error occured while editing category");
    },
  });
}

export function useCreateSubCategoryInitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      image,
      categoryId,
    }: {
      name: string;
      image: File;
      categoryId: string;
    }) => {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("image", image);
      formData.append("categoryId", categoryId);

      const { data } = await api.post<Pick<Category, "subcategories">>(
        "/create-subcategories",
        formData
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      toast.success("Sub category created successfully");
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });
      toast.error("An error occured while creating sub category");
    },
  });
}

export function useDeleteCategoryInitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryId }: { categoryId: string }) => {
      const URL = `/categories/${categoryId}`;
      const { data } = await api.delete(URL);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });

      toast.success("Category deleted successfully");
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });

      toast.error("An error occured while deleting category");
    },
  });
}

export function useDeleteSubCategoryInitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      categoryId,
      subCategoryId,
    }: {
      categoryId: string;
      subCategoryId: string;
    }) => {
      const URL = `/sub-categories/${categoryId}/${subCategoryId}`;
      const { data } = await api.delete(URL);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });

      toast.success("Sub category deleted successfully");
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-event-categories"],
      });

      toast.error("An error occured while deleting sub category");
    },
  });
}
