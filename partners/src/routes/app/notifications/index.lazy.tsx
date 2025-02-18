import Notifications from "@/features/app/notifications";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/notifications/")({
  component: Notifications,
});
