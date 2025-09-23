import EventCharityPartners from "@/features/app/events/detail/partners";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/partners/")({
  component: EventCharityPartners,
});
