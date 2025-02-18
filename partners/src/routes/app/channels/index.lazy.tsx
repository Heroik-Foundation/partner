import AllChannels from "@/features/app/channels";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/")({
  component: AllChannels,
});
