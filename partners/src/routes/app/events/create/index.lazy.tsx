import CreateEvent from "@/features/app/events/create";
import { PermissionGuard } from "@/modules/units/providers/permission-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/create/")({
  component: () => (
    <PermissionGuard
      check={(perms) => perms.canCreateEvent}
      title="Create Event Restricted"
      message="You do not have permission to create events. Viewers have read-only access."
      redirectTo="/app/events"
    >
      <CreateEvent />
    </PermissionGuard>
  ),
});
