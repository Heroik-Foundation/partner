import { useIntersectionObserver } from "@/hooks/observer";
import { EventSaleType, useTicketSalesListQuery } from "../hooks/query";
import { Fragment } from "react/jsx-runtime";
import { formatCurrency, truncateText } from "@/helpers/text";
import { getReadableTime } from "@/helpers/time";
import { ItemNotFound } from "@/modules/units/card/not-found";

export const Sales = () => {
  const {
    data: salesLogs,
    hasNextPage,
    fetchNextPage,
    isPending,
    isFetchingNextPage,
  } = useTicketSalesListQuery();

  const lastSaleRef = useIntersectionObserver<HTMLDivElement>(fetchNextPage, [
    hasNextPage,
  ]);

  const rows: EventSaleType[] = salesLogs?.pages || [];

  return (
    <div className="space-y-2.5">
      {rows.map((sale, index, list) => {
        const isLast = list.length - 1 === index;
        return (
          <div
            ref={isLast ? lastSaleRef : undefined}
            key={index}
            className="flex items-center justify-between py-3.5"
          >
            <div className="flex items-center space-x-1.5">
              <img
                className="w-10 h-10 rounded-full object-cover object-center"
                src={sale.event.photo}
              />
              <div className="flex flex-col space-y-0.5">
                <h6 className="text-xs font-semibold text-primary">User</h6>
                <span className="text-[10px] text-primary/50 font-extrabold">
                  {truncateText(sale.event.name, 100)}
                </span>
                <span className="text-[10px] text-primary/50 font-extrabold">
                  No. Of Tickets: {sale.tickets.length}
                </span>
              </div>
            </div>

            <div className="flex flex-col text-end">
              <span className="text-sm text-emerald-500 font-extrabold">
                {formatCurrency(sale.event.ticketing[0].ticketPrice)}
              </span>
              <span className="text-[10px] text-primary/50 font-extrabold">
                {getReadableTime(sale.createdAt)}
              </span>
            </div>
          </div>
        );
      })}

      {(isPending || isFetchingNextPage) && (
        <Fragment>
          <SaleSkeletonLoader />
          <SaleSkeletonLoader />
        </Fragment>
      )}

      {(!isPending || !isFetchingNextPage) && rows.length < 1 && (
        <ItemNotFound message="No sales record found" />
      )}
    </div>
  );
};

const SaleSkeletonLoader = () => {
  return (
    <div className="flex items-center justify-between animate-pulse">
      <div className="flex items-center space-x-1.5">
        <div className="w-10 h-10 rounded-full bg-gray-300" />

        <div className="flex flex-col space-y-1">
          <div className="h-3 w-24 bg-gray-300 rounded" />
          <div className="h-2 w-20 bg-gray-200 rounded" />
          <div className="h-2 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1">
        <div className="h-4 w-16 bg-gray-300 rounded" />
        <div className="h-2 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
