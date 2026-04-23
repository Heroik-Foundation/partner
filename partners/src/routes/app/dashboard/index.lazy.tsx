import CreatorDashboard from "@/features/app/home/dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/dashboard/")({
  component: CreatorDashboard,
});
