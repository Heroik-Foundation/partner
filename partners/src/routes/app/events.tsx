import { RouteTrackerProvider } from "@/features/app/events/create/modules/provider/route-tracker";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app/events")({
  component: () => (
    <RouteTrackerProvider>
      <Outlet />
    </RouteTrackerProvider>
  ),
});
