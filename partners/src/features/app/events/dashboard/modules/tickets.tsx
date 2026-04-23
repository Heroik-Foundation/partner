"use client";

import { useEventMembersTicketPurchasesQuery } from "../hooks/query";
import { Link, useParams } from "@tanstack/react-router";
import { Fragment } from "react";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { getReadableTime } from "@/helpers/time";
import { formatCurrency } from "@/helpers/text";
import { BanknoteArrowDownIcon, MoreVerticalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const TicketSales = () => {
  const { id } = useParams({
    strict: false,
  });

  const { data, isPending, isFetchingNextPage } =
    useEventMembersTicketPurchasesQuery({
      eventId: String(id),
    });

  const rows = data?.pages || [];

  return (
    <div className="space-y-5 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="font-bold text-primary">Tickets Sold</h6>
          <p className="text-sm font-medium text-primary/50">
            Event Tickets Sold So Far
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              className={cn(
                "w-[170px] h-[48px] text-primary focus:text-primary",
              )}
            >
              <Link
                to="/app/events/$id/refunds"
                params={{
                  id: String(id),
                }}
                className="flex items-center gap-2"
              >
                <BanknoteArrowDownIcon />
                <span className="text-sm font-bold">Manage Refunds</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-5">
        {rows.map((sale, index) => {
          const quantity = sale.tickets.length;
          const ticketTypeName = sale.ticketType.ticketType;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={sale.user.photo}
                  loading="eager"
                  className="w-12 h-12 rounded-lg object-cover object-center"
                />
                <div>
                  <h5 className="text-primary font-bold text-sm">
                    {sale.user.fullname || "Name"}
                  </h5>
                  <p className="text-primary/50 font-bold text-xs">
                    <span>{getReadableTime(sale.updatedAt)}</span> |{" "}
                    <span>Tickets: {sale.totalTickets}</span>
                  </p>
                  <p className="text-xs font-bold text-primary/50">
                    {ticketTypeName} Ticket(s)
                  </p>
                </div>
              </div>

              <span className="font-extrabold text-primary">
                {formatCurrency(
                  sale.ticketType.ticketPrice * Number(quantity),
                  sale.event.currency,
                )}
              </span>
            </div>
          );
        })}

        {(isPending || isFetchingNextPage) && (
          <Fragment>
            <TicketSaleSkeletonLoader />
            <TicketSaleSkeletonLoader />
          </Fragment>
        )}

        {!isPending && !isFetchingNextPage && rows.length < 1 && (
          <ItemNotFound message="No sales record found" />
        )}
      </div>
    </div>
  );
};

const TicketSaleSkeletonLoader = () => {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-lg bg-gray-300 dark:bg-gray-700" />
        <div className="space-y-1">
          <div className="h-3 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-2 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
        </div>
      </div>
      <div className="h-4 w-16 bg-gray-300 dark:bg-gray-700 rounded" />
    </div>
  );
};
