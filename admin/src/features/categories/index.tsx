import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { Category, useEventCategoriesQuery } from "./hooks/query";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCreateSubCategoryInitMutation,
  useDeleteCategoryInitMutation,
  useDeleteSubCategoryInitMutation,
} from "./hooks/mutation";
import CategoryForm from "./modules/create-category";
import { toast } from "sonner";

// Skeleton Components
const CategorySkeleton = () => (
  <div className="w-full">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-gray-200 animate-pulse" />
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="flex items-center space-x-1">
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const SubCategorySkeleton = () => (
  <div className="flex items-center w-full justify-between gap-2">
    <div className="flex items-center space-x-2">
      <div className="w-7 h-7 rounded bg-gray-200 animate-pulse" />
      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
  </div>
);

const LoadingSkeleton = () => (
  <div className="w-full mx-auto space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="space-y-3">
        <CategorySkeleton />
        {i === 0 && (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-2 pl-8">
              <SubCategorySkeleton />
              <SubCategorySkeleton />
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
);

export default function CategoryList() {
  const { data, isLoading } = useEventCategoriesQuery();
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );
  const [deletingSubCategoryId, setDeletingSubCategoryId] = useState<
    string | null
  >(null);
  const [creatingSubCategoryId, setCreatingSubCategoryId] = useState<
    string | null
  >(null);

  const { mutate: deleteCategory } = useDeleteCategoryInitMutation();
  const { mutate: deleteSubCategory } = useDeleteSubCategoryInitMutation();
  const { mutate } = useCreateSubCategoryInitMutation();

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (deletingCategoryId || deletingSubCategoryId) {
      toast.error("Please wait for the current deletion to complete");
      return;
    }
    setDeletingCategoryId(categoryId);
    deleteCategory(
      { categoryId },
      {
        onSettled: () => setDeletingCategoryId(null),
      }
    );
  };

  const handleDeleteSubCategory = (
    categoryId: string,
    subCategoryId: string
  ) => {
    if (deletingCategoryId || deletingSubCategoryId) {
      toast.error("Please wait for the current deletion to complete");
      return;
    }
    setDeletingSubCategoryId(subCategoryId);
    deleteSubCategory(
      { categoryId, subCategoryId },
      {
        onSettled: () => setDeletingSubCategoryId(null),
      }
    );
  };

  const handleCreateSubCategory = (categoryId: string, data: any) => {
    if (creatingSubCategoryId) {
      toast.error("Please wait for the current creation to complete");
      return;
    }
    if (data.file && data.name) {
      setCreatingSubCategoryId(categoryId);
      mutate(
        {
          categoryId,
          image: data.file,
          name: data.name,
        },
        {
          onSettled: () => setCreatingSubCategoryId(null),
        }
      );
    } else {
      toast.error("Complete the form to create a category");
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="w-full mx-auto space-y-4">
      {data &&
        data?.pages.flat().map((category: Category) => (
          <div key={category._id} className="w-full">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 rounded object-cover object-center"
                  // loading="eager"
                />

                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                {category.subcategories.length > 0 && (
                  <Button
                    className="space-x-1 items-center"
                    size="sm"
                    variant="secondary"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 transition-all",
                        openCategories.has(category._id) && "rotate-180"
                      )}
                    />
                  </Button>
                )}

                <CategoryForm
                  title="Create Sub Category"
                  triggerTitle="Sub Category"
                  onSubmit={(data) =>
                    handleCreateSubCategory(category._id, data)
                  }
                  isPending={creatingSubCategoryId === category._id}
                />

                <Button
                  className="space-x-1 items-center"
                  size="sm"
                  variant="destructive"
                  isLoading={deletingCategoryId === category._id}
                  onClick={() => handleDeleteCategory(category._id)}
                >
                  <Trash2 className="w-5" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {openCategories.has(category._id) && (
                <motion.div
                  key="subcategories"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 relative"
                >
                  {/* Vertical line from category image center */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border/60" />

                  <div className="space-y-3 pl-8">
                    {category.subcategories.map((sub, index) => (
                      <motion.div
                        key={sub._id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.1 }}
                        className="flex items-center w-full justify-between gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={sub.image}
                            alt={sub.name}
                            className="w-7 h-7 rounded object-cover object-center"
                            loading="eager"
                          />
                          <span className="text-sm">{sub.name}</span>
                        </div>

                        <Button
                          className="space-x-1 items-center"
                          size="sm"
                          variant="destructive"
                          isLoading={deletingSubCategoryId === sub._id}
                          onClick={() =>
                            handleDeleteSubCategory(category._id, sub._id)
                          }
                        >
                          <Trash2 className="w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
    </div>
  );
}
