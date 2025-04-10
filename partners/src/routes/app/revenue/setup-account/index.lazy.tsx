import SetupBankAccount from "@/features/app/revenue/setup/bank-account";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/revenue/setup-account/")({
  component: SetupBankAccount,
});
