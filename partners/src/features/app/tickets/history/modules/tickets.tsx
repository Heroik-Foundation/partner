import { useMemo } from "react";
import { useUserScannedTicketsQuery } from "../hooks/query";
import { useIntersectionObserver } from "@/hooks/observer";
import { getReadableTime } from "@/helpers/time";
import { Button } from "@/modules/ui/button";
import { ItemNotFound } from "@/modules/units/card/not-found";

export const ScannedTickets = ({ searchQuery }: { searchQuery: string }) => {
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useUserScannedTicketsQuery({
      searchQuery,
    });

  const rows = useMemo(() => {
    const result = data?.pages || [];
    return result;
  }, [data]);

  const lastTicketRef = useIntersectionObserver<HTMLDivElement>(fetchNextPage, [
    hasNextPage,
  ]);

  const noTicketFound = rows.length < 1 && !isPending && !isFetchingNextPage;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-primary text-sm font-bold">Tickets Scanned</h1>
        <p className="text-xs font-bold text-primary/50">
          Event tickets Scanned So Far
        </p>
      </div>

      <div>
        {rows.map((ticket, index, list) => {
          return (
            <div
              ref={list.length - 1 === index ? lastTicketRef : undefined}
              className="flex items-center justify-between py-4 border-b-2 border-primary/5"
              key={index}
            >
              <div className="flex items-center space-x-1.5">
                <img
                  className="w-8 h-8 rounded-full object-cover object-center"
                  src={ticket.user.photo}
                />
                <div className="space-y-1.5">
                  <h6 className="text-xs text-primary font-bold">
                    {ticket.user.fullname}
                  </h6>
                  <span className="text-[10px] text-primary/50 font-bold">
                    {getReadableTime(ticket.createdAt)}
                  </span>
                </div>
              </div>

              <Button className="rounded-full" variant="secondary" size="sm">
                {ticket.ticketId}
              </Button>
            </div>
          );
        })}
        {(isPending || isFetchingNextPage) && (
          <div>
            <TicketLogSkeletonLoader />
            <TicketLogSkeletonLoader />
          </div>
        )}
      </div>

      {noTicketFound && <ItemNotFound message="No Scanned Tickets" />}
    </div>
  );
};

const TicketLogSkeletonLoader = () => {
  return (
    <div className="flex items-center justify-between space-x-1.5 animate-pulse py-4 border-b-2 border-primary/5">
      <div className="flex items-center space-x-1.5">
        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        <div className="space-y-1.5">
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
          <div className="h-2 w-16 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="h-5 w-24 bg-gray-300 rounded-full"></div>
    </div>
  );
};
