import { TicketTierState } from "@/features/app/global/hooks/logic";

export function getValidTicketCount(args?: TicketTierState[]): number {
  if (args) {
    const validCount = args.filter(
      (item) => item.salesEndDate !== null && item.salesStartDate !== null
    );

    return validCount.length;
  } else {
    return 0;
  }
}
