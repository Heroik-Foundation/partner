import TicketHistory from "@/features/app/tickets/history";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/tickets/history/")({
  component: TicketHistory,
});
