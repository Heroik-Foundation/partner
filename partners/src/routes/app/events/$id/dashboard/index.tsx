import EventDashboard from "@/features/app/events/dashboard";
import { CurrencyCodeEnum } from "@/stores/currency";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  currency: z
    .nativeEnum(CurrencyCodeEnum)
    .optional()
    .default(CurrencyCodeEnum.GBP),
});

export const Route = createFileRoute("/app/events/$id/dashboard/")({
  component: EventDashboard,
  validateSearch: searchSchema,
});
