import Revenue from "@/features/app/revenue";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/")({
  component: Revenue,
});
