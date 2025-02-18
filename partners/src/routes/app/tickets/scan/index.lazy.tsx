import TicketScanner from "@/features/app/tickets/index.lazy";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/tickets/scan/")({
  component: TicketScanner,
});
