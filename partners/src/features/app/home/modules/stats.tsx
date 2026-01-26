"use client";

import { BookImage, WalletCards } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePartnerStatsQuery,
  useUserPropertiesQuery,
} from "../../global/hooks/query";

import { buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";

export function Stats() {
  const { data: user } = useUserPropertiesQuery();
  const { data: stats } = usePartnerStatsQuery({ userId: user?._id });

  const detail = [
    // {
    //   label: "Events Per Year",
    //   value: user?.eventsPerYear || 0,
    //   icon: Calendar1,
    //   bg: "bg-primary text-white",
    // },
    {
      label: "Total Events",
      value: stats?.eventsCreated || 0,
      icon: BookImage,
      bg: "bg-secondary text-white",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {detail.map((item, index, list) => {
        return (
          <div
            className={cn(
              item.bg,
              "p-3.5 sm:p-5 rounded-xl flex items-center justify-between shadow bg-center",
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

      <Link
        to="/app/revenue"
        className={cn(
          buttonVariants({
            variant: "default",
            className: "w-full h-14 sm:h-20 bg-accent rounded-xl col-span-2",
            size: "lg",
          }),
        )}
      >
        <WalletCards />
        <p className="font-bold">Event Revenue</p>
      </Link>
    </div>
  );
}
