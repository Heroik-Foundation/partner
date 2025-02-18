import Recovery from "@/features/auth/recovery";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/recovery/")({
  component: Recovery,
});
