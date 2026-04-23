import TicketRefunds from "@/features/app/events/refunds";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/events/$id/refunds/")({
  component: TicketRefunds,
});
