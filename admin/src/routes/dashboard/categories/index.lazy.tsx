import { PageTitle } from "@/components/layout/page-title";
import CategoryList from "@/features/categories";
import { useCreateCategoryInitMutation } from "@/features/categories/hooks/mutation";
import CategoryForm from "@/features/categories/modules/create-category";
import { createLazyFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/dashboard/categories/")({
  component: Page,
});

function Page() {
  const { mutate, isPending } = useCreateCategoryInitMutation();

  return (
    <div className="space-y-8">
      <PageTitle
        title="Categories"
        subTitle="View all categories"
        rightContent={
          <CategoryForm
            onSubmit={(data) => {
              if (data.file && data.name) {
                mutate({
                  image: data.file,
                  name: data.name,
                });
              } else {
                toast.error("Complete the form to create a category");
              }
            }}
            isPending={isPending}
          />
        }
      />

      <CategoryList />
    </div>
  );
}
