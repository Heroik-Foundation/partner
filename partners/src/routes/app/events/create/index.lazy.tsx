import CreateEvent from "@/features/app/events/create";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/create/")({
  component: CreateEvent,
});
