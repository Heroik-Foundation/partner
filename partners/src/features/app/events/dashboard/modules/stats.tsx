"use client";

import { Coins, Landmark, Ticket, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/helpers/text";
import { useSearch } from "@tanstack/react-router";
import backgroundImage from "../assets/event-dashboard-bg.png";

type StatProps = {
  pledge: number;
  ticket: {
    sold: number;
    revenue: number;
  };
  signups: number;
  todayDonations: number;
};

export const Stats = ({ ticket, signups, todayDonations }: StatProps) => {
  const { currency } = useSearch({
    from: "/app/events/$id/dashboard/",
  });

  const stats = [
    {
      title: "Donations",
      value: formatCurrency(todayDonations, currency),
      icon: Landmark,
    },
    {
      title: "Tickets Sold",
      value: ticket.sold.toLocaleString(),
      icon: Ticket,
    },
    {
      title: "Total Ticket Revenue",
      value: formatCurrency(ticket.revenue, currency),
      icon: Coins,
    },
    {
      title: "Event Sign-Ups",
      value: signups.toLocaleString(),
      icon: UsersRound,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5">
      {stats.map((stat, index, list) => {
        const Icon = stat.icon;
        return (
          <div
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
            }}
            key={index}
            className={cn(
              "rounded-2xl bg-secondary p-5 space-y-2.5 text-white",
              index === 0 && "bg-primary",
              list.length % 2 !== 0 && "last:col-span-2",
            )}
          >
            <div className="p-2 rounded-lg bg-white/20 w-10 h-10 flex items-center justify-center">
              <Icon size="24" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">{stat.title}</h4>
              <h2 className="text-2xl font-semibold max-w-[90%] overflow-hidden">
                {stat.value}
              </h2>
            </div>
          </div>
        );
      })}
    </div>
  );
};
