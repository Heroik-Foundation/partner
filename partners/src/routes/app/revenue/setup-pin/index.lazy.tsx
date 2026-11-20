import SetupSecurityPin from "@/features/app/revenue/setup/security-pin";
import { WalletGuard } from "@/modules/units/providers/wallet-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/setup-pin/")({
  component: () => (
    <WalletGuard>
      <SetupSecurityPin />
    </WalletGuard>
  ),
});
