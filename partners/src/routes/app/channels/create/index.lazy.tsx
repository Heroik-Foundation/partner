import CreateChannel from "@/features/app/channels/create";
import { PermissionGuard } from "@/modules/units/providers/permission-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/create/")({
  component: () => (
    <PermissionGuard
      check={(perms) => perms.canCreateChannel}
      title="Create Channel Restricted"
      message="You do not have permission to create channels. Viewers have read-only access."
      redirectTo="/app/channels"
    >
      <CreateChannel />
    </PermissionGuard>
  ),
});
