import RevenueHistory from "@/features/app/revenue/history";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/history/")({
  component: RevenueHistory,
});
