import { useIntersectionObserver } from "@/hooks/observer";
import { EventRefund, useEventRefundsListQuery } from "../hooks/query";
import { useParams } from "@tanstack/react-router";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { formatCurrency } from "@/helpers/text";
import { CurrencyCode } from "@/stores/currency";

export const PaymentRefunds = () => {
  const { id }: { id: string } = useParams({ strict: false });
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useEventRefundsListQuery({
      eventId: id,
    });

  const lastRefundRef = useIntersectionObserver<HTMLDivElement>(fetchNextPage, [
    hasNextPage,
  ]);

  const rows: EventRefund[] = data?.pages || [];

  return (
    <div className="space-y-5">
      {rows.map((refund, index) => {
        const { amount, currency, status, user, paymentIntentId } = refund;
        return (
          <div className="flex items-center justify-between" key={index}>
            <div className="flex items-center space-x-2">
              <img
                src={user.photo}
                loading="eager"
                className="w-12 h-12 rounded-lg object-cover object-center"
              />
              <div>
                <h5 className="text-primary font-bold text-sm">
                  {user.fullname || "User"}
                </h5>
                <p className="text-primary/50 font-bold text-xs">
                  <span>Id: {paymentIntentId}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-extrabold text-primary">
                {formatCurrency(amount, currency as CurrencyCode)}
              </span>
              <span className="font-bold text-primary/50 text-xs">
                Status | {status}
              </span>
            </div>
          </div>
        );
      })}

      <div ref={lastRefundRef} />

      {(isPending || isFetchingNextPage) && (
        <>
          <RefundItemSkeleton />
          <RefundItemSkeleton />
          <RefundItemSkeleton />
        </>
      )}

      {!isPending && !isFetchingNextPage && rows.length < 1 && (
        <ItemNotFound message="No refund record found" />
      )}
    </div>
  );
};

const RefundItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-primary/10 animate-pulse" />
        <div className="space-y-2">
          {/* Fullname */}
          <div className="h-3.5 w-28 rounded-md bg-primary/10 animate-pulse" />
          {/* Payment ID */}
          <div className="h-3 w-40 rounded-md bg-primary/10 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        {/* Amount */}
        <div className="h-4 w-20 rounded-md bg-primary/10 animate-pulse" />
        {/* Status */}
        <div className="h-3 w-24 rounded-md bg-primary/10 animate-pulse" />
      </div>
    </div>
  );
};
