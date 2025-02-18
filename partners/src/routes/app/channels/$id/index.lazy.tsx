import ChannelDetails from "@/features/app/channels/detail";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/$id/")({
  component: ChannelDetails,
});
