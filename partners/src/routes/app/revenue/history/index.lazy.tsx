import RevenueHistory from "@/features/app/revenue/history";
import { WalletGuard } from "@/modules/units/providers/wallet-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/history/")({
  component: () => (
    <WalletGuard>
      <RevenueHistory />
    </WalletGuard>
  ),
});
