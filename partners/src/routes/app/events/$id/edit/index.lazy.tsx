import EditEvent from "@/features/app/events/edit";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/edit/")({
  component: EditEvent,
});
