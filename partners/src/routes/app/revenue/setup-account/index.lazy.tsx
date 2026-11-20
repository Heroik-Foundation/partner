import SetupBankAccount from "@/features/app/revenue/setup/bank-account";
import { WalletGuard } from "@/modules/units/providers/wallet-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/setup-account/")({
  component: () => (
    <WalletGuard>
      <SetupBankAccount />
    </WalletGuard>
  ),
});
