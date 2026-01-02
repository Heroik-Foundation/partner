"use client";

import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { formatCurrency } from "@/helpers/text";
import { cn } from "@/lib/utils";

import eyeIcon from "../assets/eye.svg";
import messagesIcon from "../assets/messages.svg";
import dashboardIcon from "../assets/dashboard.svg";
import { CurrencyCode, CurrencyCodeEnum } from "@/stores/currency";

type InfoProps = {
  id: string;
  description: string;
  percentage: number;
  minimumPledge: number;
  startDate: string;
  organizations: string[];
  currency: CurrencyCode;
};

export default function Info(props: InfoProps) {
  const { id, description, minimumPledge, organizations, currency } = props;

  const isFundraiser = Number(minimumPledge) > 0 && organizations.length >= 1;

  return (
    <div className="space-y-5 w-full">
      <div className="w-full flex items-center justify-center space-x-2.5">
        <Link
          className={cn(
            buttonVariants({
              variant: "default",
              className: "w-full max-w-[400px]",
            })
          )}
          to="/app/events/$id/dashboard"
          params={{
            id,
          }}
          search={{
            currency: currency as CurrencyCodeEnum,
          }}
        >
          <img src={dashboardIcon} alt="" className="w-4 h-4" />{" "}
          <span className="mt-0.5">Event Dashboard</span>
        </Link>
        <Link
          to="/app/events/$id/messages"
          className={cn(
            buttonVariants({
              variant: "default",
              className: "w-full max-w-[400px]",
            })
          )}
          params={{
            id,
          }}
        >
          <img src={messagesIcon} alt="" className="w-4 h-4" />
          <span className="mt-0.5">Event Messages</span>
        </Link>
      </div>
      <div className="space-y-2 text-center">
        <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex">
          About Event
        </h5>
        <p className="text-sm font-semibold text-primary">{description}</p>
      </div>

      {isFundraiser && (
        <div className="flex items-start justify-around">
          <div className="space-y-2.5 flex flex-col items-center">
            <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
              Charity Partner (s)
            </h5>
            <Link
              to="/app/events/$id/partners"
              params={{
                id,
              }}
              className="font-bold text-xs rounded-full bg-primary py-4 px-5 w-fit mx-auto text-white inline-flex items-center space-x-2.5"
            >
              <span> View Charity Partners</span> <img src={eyeIcon} alt="" />
            </Link>
          </div>
          <div className="space-y-2.5 flex flex-col items-center">
            <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
              Minimum Pledge
            </h5>

            <span className="font-bold text-sm w-fit mx-auto rounded-full bg-primary py-3 px-5 text-white">
              {formatCurrency(minimumPledge, currency)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
