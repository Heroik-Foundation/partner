"use client";

import { BookOpenText, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePartnerStatsQuery,
  useUserPropertiesQuery,
} from "../../global/hooks/query";
import { formatCurrency } from "@/helpers/text";

export function Stats() {
  const { data: user } = useUserPropertiesQuery();
  const { data: stats } = usePartnerStatsQuery({ userId: user?._id });

  const detail = [
    {
      label: "Total Pledges",
      value: formatCurrency(stats?.totalPledgeValue || 0),
      icon: BookOpenText,
      bg: "bg-primary text-white",
    },
    {
      label: "Total Events",
      value: stats?.eventsCreated || 0,
      icon: CalendarClock,
      bg: "bg-secondary text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {detail.map((item, index) => {
        return (
          <div
            className={cn(
              item.bg,
              "p-4 rounded-2xl flex items-center justify-between shadow bg-center"
            )}
            key={index}
          >
            <div className="font-axiforma">
              <span className="font-bold text-sm">{item.label}</span>
              <h2 className="text-2xl font-bold">{item.value}</h2>
            </div>

            <div className="p-2 rounded-lg bg-white/20">
              <item.icon size="16" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
