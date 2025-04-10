import Chat from "@/features/app/events/messages/chat";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/messages/$id/")({
  component: Chat,
});
