"use client";

import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { MessageCircle, Table } from "lucide-react";
import { formatCurrency } from "@/helpers/text";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { useCountdown } from "../../share/hooks/logic";

type InfoProps = {
  id: string;
  description: string;
  percentage: number;
  minimumPledge: number;
  startDate: string;
  organizations: string[];
};

const isLongText = (text: string) => text.length > 20;

export default function Info(props: InfoProps) {
  const {
    id,
    description,
    percentage,
    minimumPledge,
    organizations,
    startDate,
  } = props;

  console.log(props);

  const isFundraiser = Number(minimumPledge) > 0 && organizations.length >= 1;

  const { days, hours, minutes, seconds } = useCountdown(startDate);

  const countdown = [
    {
      title: "Days",
      data: days,
    },
    {
      title: "Hours",
      data: hours,
    },
    {
      title: "Minutes",
      data: minutes,
    },
    {
      title: "Seconds",
      data: seconds,
    },
  ];

  return (
    <div className="space-y-5 w-full">
      <div className="w-full flex flex-col items-center min-[385px]:flex-row space-y-2.5 min-[385px]:space-y-0 min-[385px]:space-x-2.5">
        <Link
          className={cn(
            buttonVariants({
              variant: "default",
              className: "w-full",
            })
          )}
          to="/app/events/$id/dashboard"
          params={{
            id,
          }}
        >
          <Table size="16" /> <span className="mt-0.5">Event Dashboard</span>
        </Link>
        <Link
          to="/app/events/$id/messages"
          className={cn(
            buttonVariants({
              variant: "default",
              className: "w-full",
            })
          )}
          params={{
            id,
          }}
        >
          <MessageCircle size="16" />{" "}
          <span className="mt-0.5">Event Messages</span>
        </Link>
      </div>
      <div className="space-y-2">
        <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex">
          About Event
        </h5>
        <p className="text-sm font-semibold text-primary">{description}</p>
      </div>

      {isFundraiser && (
        <Fragment>
          <div className="space-y-2.5">
            <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex">
              Charity Partner (s)
            </h5>
            <div className="flex flex-wrap gap-2">
              {organizations.length > 0 ? (
                organizations.map((item, index) => (
                  <div
                    key={index}
                    className={`
                flex-shrink-0 
                py-2 px-5 
                bg-primary 
                ${isLongText(item) ? "w-full rounded-xl" : "rounded-full"}
              `}
                  >
                    <span className="font-semibold text-sm text-white">
                      {item}
                    </span>
                  </div>
                ))
              ) : (
                <div className="w-full">
                  <span className="font-semibold text-sm rounded-full bg-blue-600 py-2 px-5 text-white">
                    No Partner(s)
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2.5">
            <div>
              <h4 className="font-bold text-primary">Pledge</h4>
              <p className="text-xs text-primary/50 font-semibold">
                The amount you commit to raising for charity through this event.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <SemiCircleProgressBar value={percentage} size={300}>
                <h2 className="text-2xl font-bold text-primary">
                  {formatCurrency(minimumPledge)}
                </h2>
                <span className="text-sm px-2.5 py-1 rounded-lg bg-green-500/15 text-green-600 font-semibold inline-flex">
                  Minimum Pledge
                </span>{" "}
              </SemiCircleProgressBar>
            </div>
          </div>
        </Fragment>
      )}

      {!isFundraiser && (
        <Fragment>
          <div className="flex flex-col items-start justify-center space-y-2.5">
            <span className="py-2 px-5 bg-primary/15 text-primary text-xs font-extrabold rounded-lg">
              Event Countdown
            </span>

            <div className="flex items-center space-x-2.5 w-full">
              {countdown.map((measure, index) => {
                return (
                  <div
                    key={index}
                    className="space-y-2.5 flex flex-col justify-center items-center w-full"
                  >
                    <div className="bg-primary/30 p-2.5 rounded-lg w-full">
                      <h1 className="text-[44px] font-black text-primary text-center w-full">
                        {measure.data}
                      </h1>
                    </div>
                    <span className="text-xs font-black text-primary">
                      {measure.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
}

export const SemiCircleProgressBar = ({
  value,
  size = 120,
  children,
}: {
  value: number;
  size?: number;
  children?: React.ReactNode;
}) => {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size / 2 + strokeWidth,
      }}
    >
      <svg
        width={size}
        height={size / 2 + strokeWidth}
        viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
        className="block mx-auto"
      >
        <path
          d={`M${strokeWidth / 2},${radius + strokeWidth / 2} A${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${
            radius + strokeWidth / 2
          }`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />

        <path
          d={`M${strokeWidth / 2},${radius + strokeWidth / 2} A${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${
            radius + strokeWidth / 2
          }`}
          fill="none"
          stroke="#37137f"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
          }}
        />
      </svg>
      {/* Render custom children */}
      <div
        className="absolute top-0 left-0 flex flex-col space-y-2 items-center justify-center"
        style={{
          width: size,
          height: size / 2,
          transform: `translateY(${strokeWidth / 2}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
