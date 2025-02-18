import AllEvents from "@/features/app/events";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/")({
  component: AllEvents,
});
