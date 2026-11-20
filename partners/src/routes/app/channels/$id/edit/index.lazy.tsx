import EditChannel from "@/features/app/channels/edit";
import { PermissionGuard } from "@/modules/units/providers/permission-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/$id/edit/")({
  component: () => (
    <PermissionGuard
      check={(perms) => perms.canEditChannel}
      title="Edit Channel Restricted"
      message="You do not have permission to edit channels. Viewers have read-only access."
      redirectTo="/app/channels"
    >
      <EditChannel />
    </PermissionGuard>
  ),
});
