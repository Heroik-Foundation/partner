"use client";

import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { MessageCircle, Table } from "lucide-react";
import { formatCurrency } from "@/helpers/text";
import { cn } from "@/lib/utils";

type InfoProps = {
  id: string;
  description: string;
  percentage: number;
  minimumPledge: number;
};

export default function Info(props: InfoProps) {
  const { id, description, percentage, minimumPledge } = props;
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
      <div className="space-y-2.5">
        <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex">
          Charity Partner (s)
        </h5>
        <div>
          <span className="font-semibold text-sm rounded-full bg-primary py-2 px-5 text-white">
            No Partner(s)
          </span>
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
