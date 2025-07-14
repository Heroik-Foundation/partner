import ManagePartnersPage from "@/features/partners";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/partners/")({
  component: ManagePartnersPage,
});
