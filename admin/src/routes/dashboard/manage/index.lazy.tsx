import { PageTitle } from "@/components/layout/page-title";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/manage/")({
  component: () => <Page />,
});

function Page() {
  return (
    <div className="space-y-8">
      <PageTitle title="Manage Admin" subTitle="Manage administrators" />
    </div>
  );
}
