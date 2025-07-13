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

export default function CategoryList() {
  const { data, isLoading } = useEventCategoriesQuery();
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);

  const { mutate: deleteCategory, isPending: isDeletingCategory } =
    useDeleteCategoryInitMutation();
  const { mutate: deleteSubCategory, isPending: isDeletingSubCategory } =
    useDeleteSubCategoryInitMutation();

  const { mutate, isPending } = useCreateSubCategoryInitMutation();

  const toggleCategory = (id: string) => {
    setOpenCategoryId((prev) => (prev === id ? null : id));
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="w-full mx-auto space-y-2">
      {data &&
        data?.pages.flat().map((category: Category) => (
          <div key={category._id} className="w-full">
            <div className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-10 h-10 rounded object-cover object-center"
                  loading="eager"
                />
                <span className="font-medium">{category.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  className="space-x-1 items-center"
                  size="sm"
                  variant="secondary"
                  onClick={() => toggleCategory(category._id)}
                >
                  <span>View</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-all",
                      openCategoryId === category._id && "rotate-180"
                    )}
                  />
                </Button>

                <CategoryForm
                  title="Create Sub Category"
                  triggerTitle="Create Sub Category"
                  onSubmit={(data) => {
                    if (data.file && data.name) {
                      mutate({
                        categoryId: category._id,
                        image: data.file,
                        name: data.name,
                      });
                    } else {
                      toast.error("Complete the form to create a category");
                    }
                  }}
                  isPending={isPending}
                />

                <Button
                  className="space-x-1 items-center"
                  size="sm"
                  variant="destructive"
                  isLoading={isDeletingCategory}
                  onClick={() => {
                    deleteCategory({
                      categoryId: category._id,
                    });
                  }}
                >
                  <span>Delete</span>
                  <Trash2 className="w-5" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {openCategoryId === category._id && (
                <motion.div
                  key="subcategories"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-4 space-y-2 bg-primary/5 rounded-xl p-5"
                >
                  {category.subcategories.map((sub) => (
                    <motion.div
                      key={sub._id}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -10, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center w-full justify-between gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className="w-7 h-7 rounded object-cover object-center"
                          loading="eager"
                        />
                        <span>{sub.name}</span>
                      </div>

                      <Button
                        className="space-x-1 items-center"
                        size="sm"
                        variant="destructive"
                        isLoading={isDeletingSubCategory}
                        onClick={() => {
                          deleteSubCategory({
                            categoryId: category._id,
                            subCategoryId: sub._id,
                          });
                        }}
                      >
                        <Trash2 className="w-5" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
    </div>
  );
}
