"use client";

import { BookImage, CoinsIcon, UsersRoundIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePartnerStatsQuery,
  useUserPropertiesQuery,
} from "../../global/hooks/query";

import { formatCurrency } from "@/helpers/text";
import { usePermissions } from "@/hooks/use-permissions";

export function Stats() {
  const { data: user } = useUserPropertiesQuery();
  const { data: stats } = usePartnerStatsQuery({ userId: user?._id });
  const { canAccessWallet } = usePermissions();

  const allDetails = [
    {
      label: "Total Events",
      value: stats?.eventsCreated || 0,
      icon: BookImage,
      bg: "bg-secondary text-white",
    },
    {
      label: "Channels",
      value: stats?.totalCreatedCommunities || 0,
      icon: UsersRoundIcon,
      bg: "bg-secondary text-white",
    },
    ...(canAccessWallet
      ? [
          {
            label: "Balance",
            value: formatCurrency(Number(stats?.walletBalance || 0), "gbp"),
            icon: CoinsIcon,
            bg: "bg-accent text-white",
          },
        ]
      : []),
    {
      label: "Ticket Sales",
      value: formatCurrency(Number(stats?.ticketSales || 0), "gbp"),
      icon: CoinsIcon,
      bg: "bg-accent text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5">
      {allDetails.map((item, index, list) => {
        return (
          <div
            className={cn(
              item.bg,
              "p-3.5 sm:p-5 rounded-xl flex items-center justify-between shadow bg-center relative",
              list.length % 2 !== 0 && "last:col-span-2",
              list.length < 2 && "col-span-2",
            )}
            key={index}
          >
            <div className="font-axiforma">
              <span className="font-bold text-sm">{item.label}</span>
              <h2 className="text-2xl font-bold">{item.value}</h2>
            </div>

            <div className="p-1.5 rounded-lg bg-white/20">
              <item.icon size="16" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
