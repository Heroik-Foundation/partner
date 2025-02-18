import SetupRecoveryPassword from "@/features/auth/recovery/password";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/recovery/password/")({
  component: SetupRecoveryPassword,
});
