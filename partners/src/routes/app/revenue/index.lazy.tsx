import Revenue from "@/features/app/revenue";
import { WalletGuard } from "@/modules/units/providers/wallet-guard";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/")({
  component: () => (
    <WalletGuard>
      <Revenue />
    </WalletGuard>
  ),
});
