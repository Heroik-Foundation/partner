import ShareEvent from "@/features/app/events/share";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/event/$id/")({
  component: ShareEvent,
});
