import { useIntersectionObserver } from "@/hooks/observer";
import { useWithdrawalLogsListQuery } from "../hooks/query";
import { WithdrawalLog } from "@/features/app/global/types";
import { BadgeEuro } from "lucide-react";
import { getReadableTime } from "@/helpers/time";
import { formatNumberSequence } from "@/helpers/text";
import { Fragment } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
import { ItemNotFound } from "@/modules/units/card/not-found";

export const Withdrawals = () => {
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useWithdrawalLogsListQuery();

  const lastWithdrawalRef = useIntersectionObserver<HTMLDivElement>(
    fetchNextPage,
    [hasNextPage]
  );

  const rows: WithdrawalLog[] = data?.pages || [];

  return (
    <div className="space-y-2.5">
      {rows.map((log, index, list) => {
        const isLast = list.length - 1 === index;
        return (
          <div
            key={index}
            className={cn(
              "flex items-end justify-between border-b py-2.5",
              isLast && "border-none"
            )}
            ref={isLast ? lastWithdrawalRef : undefined}
          >
            <div className="flex items-center space-x-1.5">
              <BadgeEuro size={40} className="fill-primary stroke-white" />
              <div>
                <h6 className="text-xs font-bold text-emerald-500">
                  £{log.amount} Withdrawn
                </h6>
                <span className="text-[10px] font-semibold text-primary/50">
                  Bank Account {formatNumberSequence(log.bankAccountNumber)}
                </span>
              </div>
            </div>

            <span className="text-[8px] text-primary/50 font-extrabold">
              {getReadableTime(log.createdAt)}
            </span>
          </div>
        );
      })}
      {(isPending || isFetchingNextPage) && (
        <Fragment>
          <LogSkeletonLoader />
          <LogSkeletonLoader />
        </Fragment>
      )}
      {(!isPending || !isFetchingNextPage) && rows.length < 1 && (
        <ItemNotFound message="No withdrawal record found" />
      )}
    </div>
  );
};

const LogSkeletonLoader = () => {
  return (
    <div className="flex items-end justify-between animate-pulse py-2.5">
      <div className="flex items-center space-x-1.5">
        <div className="h-10 w-10 bg-gray-300 rounded-full" />{" "}
        <div className="space-y-1">
          <div className="h-3 w-36 bg-gray-300 rounded" />
          <div className="h-2 w-28 bg-gray-200 rounded" />{" "}
        </div>
      </div>
      <div className="h-2 w-20 bg-gray-200 rounded" />
    </div>
  );
};
