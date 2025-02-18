import Messages from "@/features/app/events/messages";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/messages/")({
  component: Messages,
});
