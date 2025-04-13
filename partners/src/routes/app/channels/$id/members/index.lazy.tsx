import ManageMembers from "@/features/app/channels/members";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/$id/members/")({
  component: ManageMembers,
});
