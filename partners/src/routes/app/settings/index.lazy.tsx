import Settings from "@/features/app/settings";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/settings/")({
  component: Settings,
});
