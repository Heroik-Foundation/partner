"use client";

import { BookImage, CoinsIcon, UsersRoundIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePartnerStatsQuery,
  useUserPropertiesQuery,
} from "../../global/hooks/query";
import { Link } from "@tanstack/react-router";
import { useMediaQuery } from "@/hooks/media-query";

export function Stats() {
  const { data: user } = useUserPropertiesQuery();
  const { data: stats } = usePartnerStatsQuery({ userId: user?._id });
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const detail = [
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
    {
      label: "Balance",
      value: `$${Number(Number(stats?.walletBalance || 0) / 100).toFixed(3)}`,
      icon: CoinsIcon,
      bg: "bg-accent text-white",
    },
    {
      label: "Ticket Sales",
      value: `$${Number(Number(stats?.ticketSales || 0) / 100).toFixed(3)}`,
      icon: CoinsIcon,
      bg: "bg-accent text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {detail.map((item, index, list) => {
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

            {index === 2 && !isDesktop && (
              <Link
                to="/app/revenue"
                className="absolute bg-white text-primary px-5 py-1 border-2 border-primary/20 rounded-full text-sm font-semibold -bottom-5 left-1/2 -translate-x-1/2"
              >
                Manage
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
