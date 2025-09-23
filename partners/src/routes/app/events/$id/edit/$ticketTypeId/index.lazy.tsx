import EditTicketType from "@/features/app/events/edit/edit-ticket-type";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/events/$id/edit/$ticketTypeId/")(
  {
    component: EditTicketType,
  }
);
