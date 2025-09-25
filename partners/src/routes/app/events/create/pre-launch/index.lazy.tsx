import { PreLaunch } from "@/features/app/events/create/options/pre-launch";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/create/pre-launch/")({
  component: PreLaunch,
});
