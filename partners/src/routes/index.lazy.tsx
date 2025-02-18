import Onboarding from "@/features/auth/home";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Onboarding,
});
