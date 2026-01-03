import ManageProfiles from "@/features/app/profile/manage";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/profile/manage/")({
  component: ManageProfiles,
});
