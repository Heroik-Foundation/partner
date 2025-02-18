import EventDetail from "@/features/app/events/detail";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/")({
  component: EventDetail,
});
