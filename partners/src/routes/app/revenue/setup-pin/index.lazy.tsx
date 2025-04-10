import SetupSecurityPin from "@/features/app/revenue/setup/security-pin";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/setup-pin/")({
  component: SetupSecurityPin,
});
