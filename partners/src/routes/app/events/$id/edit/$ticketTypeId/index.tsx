import EditTicketType from "@/features/app/events/edit/edit-ticket-type";
import { CurrencyCodeEnum } from "@/stores/currency";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  currency: z
    .nativeEnum(CurrencyCodeEnum)
    .optional()
    .default(CurrencyCodeEnum.GBP),
});

export const Route = createFileRoute("/app/events/$id/edit/$ticketTypeId/")({
  component: EditTicketType,
  validateSearch: searchSchema,
});
