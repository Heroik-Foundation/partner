import { ShareChannel } from "@/features/app/channels/share";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/channel/$id/")({
  component: ShareChannel,
});
