import EventDashboard from "@/features/app/events/dashboard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/dashboard/")({
  component: EventDashboard,
});
