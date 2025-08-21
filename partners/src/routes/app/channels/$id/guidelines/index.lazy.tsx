import ChannelGuidelines from "@/features/app/channels/detail/guidelines";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/$id/guidelines/")({
  component: ChannelGuidelines,
});
