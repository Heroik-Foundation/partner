import CreateChannel from "@/features/app/channels/create";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/create/")({
  component: CreateChannel,
});
