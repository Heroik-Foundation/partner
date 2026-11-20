import {
  useUserMembershipQuery,
  useUserPropertiesQuery,
} from "@/features/app/global/hooks/query";
import { getActiveSession } from "@/lib/session";

export type RoleTag = "Admin" | "View" | "Owner" | "User";

export function usePermissions() {
  const { data: membership, isLoading: isMembershipLoading } =
    useUserMembershipQuery();
  const { data: partnerUser, isLoading: isPartnerLoading } =
    useUserPropertiesQuery();
  const activeSession = getActiveSession();

  // Normalize role from membership or user object
  const rawRole = (
    membership?.role ||
    membership?.user?.role ||
    ""
  )
    .toLowerCase()
    .trim();

  const isAdmin = rawRole === "admin";
  const isViewer =
    rawRole === "viewer" ||
    rawRole === "view" ||
    rawRole === "user" ||
    rawRole === "member";
  const isOwner =
    rawRole === "owner" ||
    (!rawRole && !isAdmin && !isViewer);

  // Tag displayed next to user's name: "Admin", "View", or "Owner"
  let roleTag: RoleTag = "Owner";
  if (isAdmin) {
    roleTag = "Admin";
  } else if (isViewer) {
    roleTag = "View";
  } else if (isOwner) {
    roleTag = "Owner";
  } else {
    roleTag = "User";
  }

  // Permissions array normalization
  const permissions: string[] = Array.isArray(membership?.permissions)
    ? membership.permissions
    : typeof membership?.permissions === "string"
      ? [membership.permissions]
      : [];

  const hasPermission = (permission: string) => {
    if (isOwner) return true;
    if (permissions.includes("client.*") || permissions.includes("*")) {
      return true;
    }
    return permissions.includes(permission);
  };

  /**
   * Restrictions explicitly specified:
   * "make sure both admin and users can't access wallet, and any thing to do with password, and user information update"
   */
  const canAccessWallet = isOwner;
  const canManagePassword = isOwner;
  const canUpdateUserInfo = isOwner;

  /**
   * Functional operational permissions for viewers vs admins vs owner:
   * Viewers have read-only access (restricted from creating/editing/deleting).
   */
  const canCreateEvent =
    !isViewer && (isOwner || hasPermission("events.create"));
  const canEditEvent =
    !isViewer && (isOwner || hasPermission("events.update"));
  const canDeleteEvent =
    !isViewer && (isOwner || hasPermission("events.delete"));
  const canCreateChannel =
    !isViewer && (isOwner || hasPermission("community.create"));
  const canEditChannel =
    !isViewer && (isOwner || hasPermission("community.edit"));
  const canDeleteChannel =
    !isViewer && (isOwner || hasPermission("community.delete"));
  const canScanTickets =
    isOwner ||
    hasPermission("ticket.scan") ||
    (isAdmin && permissions.length === 0);
  const canViewDashboard =
    isOwner || isAdmin || hasPermission("analytics.view");

  /**
   * Member display name:
   * Prefers the signed-in team member's full name, falling back to session/partner name.
   */
  const memberName =
    membership?.user?.fullname ||
    membership?.user?.username;
  const displayName =
    memberName ||
    activeSession?.name ||
    partnerUser?.name ||
    "Partner";

  return {
    membership,
    isLoading: isMembershipLoading || isPartnerLoading,
    role: rawRole || (isOwner ? "owner" : "user"),
    roleTag,
    displayName,
    permissions,
    isOwner,
    isAdmin,
    isViewer,
    canAccessWallet,
    canManagePassword,
    canUpdateUserInfo,
    canCreateEvent,
    canEditEvent,
    canDeleteEvent,
    canCreateChannel,
    canEditChannel,
    canDeleteChannel,
    canScanTickets,
    canViewDashboard,
    hasPermission,
  };
}
