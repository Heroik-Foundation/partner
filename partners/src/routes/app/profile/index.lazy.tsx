import Profile from "@/features/app/profile";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/profile/")({
  component: Profile,
});
