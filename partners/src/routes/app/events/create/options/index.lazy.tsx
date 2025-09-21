import CreateEventOptions from "@/features/app/events/create/options";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/create/options/")({
  component: CreateEventOptions,
});
