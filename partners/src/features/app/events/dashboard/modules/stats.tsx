"use client";

import { Currency, Coins, Ticket, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/helpers/text";

type StatProps = {
  pledge: number;
  ticket: {
    sold: number;
    revenue: number;
  };
  signups: number;
};

export const Stats = ({ pledge, ticket, signups }: StatProps) => {
  const stats = [
    {
      title: "Total Pledged Amount",
      value: formatCurrency(pledge),
      icon: Currency,
    },
    {
      title: "Tickets Sold",
      value: ticket.sold.toLocaleString(),
      icon: Ticket,
    },
    {
      title: "Total Ticket Revenue",
      value: formatCurrency(ticket.revenue),
      icon: Coins,
    },
    {
      title: "Event Signup",
      value: signups.toLocaleString(),
      icon: UsersRound,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={cn(
              "rounded-2xl bg-secondary p-5 space-y-2.5 text-white",
              index === 1 && "bg-primary"
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
