import EditEvent from "@/features/app/events/edit";
import { PermissionGuard } from "@/modules/units/providers/permission-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/edit/")({
  component: () => (
    <PermissionGuard
      check={(perms) => perms.canEditEvent}
      title="Edit Event Restricted"
      message="You do not have permission to edit events. Viewers have read-only access."
      redirectTo="/app/events"
    >
      <EditEvent />
    </PermissionGuard>
  ),
});
