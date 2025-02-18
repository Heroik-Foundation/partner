import { PageTitle } from "@/components/layout/page-title";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/reports/")({
  component: () => <Page />,
});

function Page() {
  return (
    <div className="space-y-8">
      <PageTitle title="Reports" subTitle="View all reports" />
    </div>
  );
}
