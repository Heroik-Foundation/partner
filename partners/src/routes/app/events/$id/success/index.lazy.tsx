import EventCreationSuccess from "@/features/app/events/create/success";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/success/")({
  component: EventCreationSuccess,
});
