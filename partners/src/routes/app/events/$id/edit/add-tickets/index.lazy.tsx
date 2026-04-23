import AddTicketType from "@/features/app/events/edit/add-ticket-type";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/edit/add-tickets/")({
  component: AddTicketType,
});
