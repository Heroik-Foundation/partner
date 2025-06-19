"use client";

import { useEventMembersTicketPurchasesQuery } from "../hooks/query";
import { useParams } from "@tanstack/react-router";
import { Fragment } from "react";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { getReadableTime } from "@/helpers/time";

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
      </div>

      <div className="space-y-5">
        {rows.map((sale, index) => {
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img
                  src={sale.user.photo}
                  loading="eager"
                  className="w-10 h-10 rounded-lg object-cover object-center"
                />
                <div>
                  <h5 className="text-primary font-bold text-sm">
                    {sale.user.fullname || "Name"}
                  </h5>
                  <p className="text-primary/50 font-bold text-xs">
                    <span>{getReadableTime(sale.updatedAt)}</span> |{" "}
                    <span>Tickets: {sale.totalTickets}</span>
                  </p>
                </div>
              </div>

              <span className="font-extrabold text-primary">
                £{Number(sale.event.eventTicket.ticketPrice) / 100}
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
