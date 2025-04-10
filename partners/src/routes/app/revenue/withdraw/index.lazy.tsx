import WithdrawRevenue from "@/features/app/revenue/withdraw";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/withdraw/")({
  component: WithdrawRevenue,
});
