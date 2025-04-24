import ShareEvent from "@/features/app/events/share";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/share/$id/")({
  component: ShareEvent,
});
