import { useIntersectionObserver } from "@/hooks/observer";
import { EventVoucher, useEventVouchersListQuery } from "../hooks/query";
import { useParams } from "@tanstack/react-router";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { getReadableTime, isPastDate } from "@/helpers/time";
import { formatCurrency } from "@/helpers/text";
import { CurrencyCode } from "@/stores/currency";

export const Vouchers = () => {
  const { id }: { id: string } = useParams({ strict: false });
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useEventVouchersListQuery({
      eventId: id,
    });

  const lastVoucherRef = useIntersectionObserver<HTMLDivElement>(
    fetchNextPage,
    [hasNextPage],
  );

  const rows: EventVoucher[] = data?.pages || [];

  return (
    <div className="space-y-5">
      {rows.map((voucher, index) => {
        const { user, expiryDate, code, event, amount, amountLeft } = voucher;
        const isPast = isPastDate(expiryDate);
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
                  <span>Code: {code}</span>
                </p>
                <p className="text-xs font-bold text-primary/50">
                  Expire{isPast ? "d" : "s"} {getReadableTime(expiryDate)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-extrabold text-primary">
                {/* //@ts-ignore */}
                {formatCurrency(amount, event.currency as CurrencyCode)}
              </span>
              <span className="font-bold text-primary/50 text-xs">
                {/* //@ts-ignore */}
                {formatCurrency(
                  amountLeft,
                  event.currency as CurrencyCode,
                )}{" "}
                Left
              </span>
            </div>
          </div>
        );
      })}

      <div ref={lastVoucherRef} />

      {(isPending || isFetchingNextPage) && (
        <>
          <VoucherItemSkeleton />
          <VoucherItemSkeleton />
          <VoucherItemSkeleton />
        </>
      )}

      {!isPending && !isFetchingNextPage && rows.length < 1 && (
        <ItemNotFound message="No voucher record found" />
      )}
    </div>
  );
};

export const VoucherItemSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-lg bg-primary/10 animate-pulse" />
        <div className="space-y-2">
          {/* Fullname */}
          <div className="h-3.5 w-28 rounded-md bg-primary/10 animate-pulse" />
          {/* Code */}
          <div className="h-3 w-32 rounded-md bg-primary/10 animate-pulse" />
          {/* Expiry */}
          <div className="h-3 w-24 rounded-md bg-primary/10 animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col items-end space-y-2">
        {/* Amount */}
        <div className="h-4 w-20 rounded-md bg-primary/10 animate-pulse" />
        {/* Amount left */}
        <div className="h-3 w-16 rounded-md bg-primary/10 animate-pulse" />
      </div>
    </div>
  );
};
