import EditChannel from "@/features/app/channels/edit";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/$id/edit/")({
  component: EditChannel,
});
