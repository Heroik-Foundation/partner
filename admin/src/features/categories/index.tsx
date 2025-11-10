import { useEffect, useState } from "react";
import { ChevronDown, MoreHorizontalIcon, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Category, useEventCategoriesQuery } from "./hooks/query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCreateSubCategoryInitMutation,
  useDeleteCategoryInitMutation,
  useDeleteSubCategoryInitMutation,
  useEditCategoryMutation,
} from "./hooks/mutation";
import CategoryForm from "./modules/create-category";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";

// Types
interface SubCategoryFormData {
  file?: File | null; // Allow null to match CategoryFormData
  name: string;
}

// Skeleton Components
const CategorySkeleton = () => (
  <div className="w-full">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
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
      <div className="w-5 h-5 rounded bg-gray-200 animate-pulse" />
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

interface CategoryItemProps {
  category: Category;
  isOpen: boolean;
  onToggle: (id: string) => void;
  onDeleteCategory: (id: string) => void;
  onDeleteSubCategory: (categoryId: string, subCategoryId: string) => void;
  onCreateSubCategory: (categoryId: string, data: SubCategoryFormData) => void;
  deletingCategoryId: string | null;
  deletingSubCategoryId: string | null;
  creatingSubCategoryId: string | null;
}

const CategoryItem = ({
  category,
  isOpen,
  onToggle,
  onDeleteCategory,
  onDeleteSubCategory,
  onCreateSubCategory,
  deletingCategoryId,
  deletingSubCategoryId,
  creatingSubCategoryId,
}: CategoryItemProps) => {
  const [showCreateSubDialog, setShowCreateSubDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const {
    mutate: editCategory,
    isPending: isEditing,
    isSuccess,
  } = useEditCategoryMutation();

  useEffect(() => {
    if (!isEditing && !showEditDialog) {
      setShowEditDialog(false);
    }
    if (isSuccess) {
      setShowEditDialog(false);
    }
  }, [isEditing, showEditDialog, isSuccess]);

  const handleDelete = () => {
    if (deletingCategoryId || deletingSubCategoryId) {
      toast.error("Please wait for the current deletion to complete");
      return;
    }
    onDeleteCategory(category._id);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={category.image}
            alt={category.name}
            className="w-5 h-5 rounded object-contain object-center"
          />
          <span className="font-medium text-sm">{category.name}</span>
        </div>

        <div className="flex items-center space-x-1">
          {category.subcategories.length > 0 && (
            <Button
              size="sm"
              variant="link"
              onClick={() => onToggle(category._id)}
              className="space-x-1 items-center"
            >
              <ChevronDown
                className={cn(
                  "w-5 h-5 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                aria-label="Open menu"
                size="icon"
                className="size-8"
                disabled={deletingCategoryId === category._id}
              >
                {deletingCategoryId === category._id ? (
                  <Spinner className="size-3" />
                ) : (
                  <MoreHorizontalIcon className="size-3" />
                )}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onSelect={() => setShowCreateSubDialog(true)}>
                  New Sub Category
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
                  Edit Category
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={handleDelete}
                  className="text-rose-500 bg-rose-500/10 focus:text-rose-500"
                >
                  Delete Category
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <CategoryForm
            open={showCreateSubDialog}
            setOpen={setShowCreateSubDialog}
            title="Create Sub Category"
            onSubmit={(data) => onCreateSubCategory(category._id, data)}
            isPending={creatingSubCategoryId === category._id}
          />

          <CategoryForm
            open={showEditDialog}
            setOpen={setShowEditDialog}
            title="Edit Category"
            initalValues={{
              image: category.image,
              name: category.name,
            }}
            onSubmit={(data) =>
              editCategory({
                categoryId: category._id,
                image: data.file,
                name: data.name || category.name,
              })
            }
            isPending={isEditing}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-4 relative"
          >
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
                      className="w-5 h-5 rounded object-contain object-center"
                      loading="lazy"
                    />
                    <span className="text-sm">{sub.name}</span>
                  </div>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteSubCategory(category._id, sub._id)}
                    disabled={deletingSubCategoryId === sub._id}
                    className="size-8"
                  >
                    {deletingSubCategoryId === sub._id ? (
                      <Spinner className="size-3" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
  const { mutate: createSubCategory } = useCreateSubCategoryInitMutation();

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
      { onSettled: () => setDeletingCategoryId(null) }
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
      { onSettled: () => setDeletingSubCategoryId(null) }
    );
  };

  const handleCreateSubCategory = (
    categoryId: string,
    data: SubCategoryFormData
  ) => {
    if (creatingSubCategoryId) {
      toast.error("Please wait for the current creation to complete");
      return;
    }
    if (!data.file || !data.name) {
      toast.error("Complete the form to create a sub category");
      return;
    }
    setCreatingSubCategoryId(categoryId);
    createSubCategory(
      {
        categoryId,
        image: data.file,
        name: data.name,
      },
      { onSettled: () => setCreatingSubCategoryId(null) }
    );
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="w-full mx-auto space-y-4">
      {data?.pages.flat().map((category: Category) => (
        <CategoryItem
          key={category._id}
          category={category}
          isOpen={openCategories.has(category._id)}
          onToggle={toggleCategory}
          onDeleteCategory={handleDeleteCategory}
          onDeleteSubCategory={handleDeleteSubCategory}
          onCreateSubCategory={handleCreateSubCategory}
          deletingCategoryId={deletingCategoryId}
          deletingSubCategoryId={deletingSubCategoryId}
          creatingSubCategoryId={creatingSubCategoryId}
        />
      ))}
    </div>
  );
}
