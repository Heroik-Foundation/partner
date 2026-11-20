import WithdrawRevenue from "@/features/app/revenue/withdraw";
import { WalletGuard } from "@/modules/units/providers/wallet-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/withdraw/")({
  component: () => (
    <WalletGuard>
      <WithdrawRevenue />
    </WalletGuard>
  ),
});
