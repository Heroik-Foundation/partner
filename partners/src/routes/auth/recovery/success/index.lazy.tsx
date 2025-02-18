import { createLazyFileRoute } from "@tanstack/react-router";
import RecoverySuccess from "@/features/auth/recovery/success";

export const Route = createLazyFileRoute("/auth/recovery/success/")({
  component: RecoverySuccess,
});
