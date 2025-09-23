"use client";

import { Link } from "@tanstack/react-router";
import { buttonVariants } from "@/modules/ui/button";
import { formatCurrency } from "@/helpers/text";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";
import { useCountdown } from "../../share/hooks/logic";

import eyeIcon from "../assets/eye.svg";
import messagesIcon from "../assets/messages.svg";
import dashboardIcon from "../assets/dashboard.svg";

type InfoProps = {
  id: string;
  description: string;
  percentage: number;
  minimumPledge: number;
  startDate: string;
  organizations: string[];
};

export default function Info(props: InfoProps) {
  const { id, description, minimumPledge, organizations, startDate } = props;

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
              {formatCurrency(minimumPledge)}
            </span>
          </div>
        </div>
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

// export const SemiCircleProgressBar = ({
//   value,
//   size = 120,
//   children,
// }: {
//   value: number;
//   size?: number;
//   children?: React.ReactNode;
// }) => {
//   const strokeWidth = 10;
//   const radius = (size - strokeWidth) / 2;
//   const circumference = Math.PI * radius;
//   const offset = circumference - (value / 100) * circumference;

//   return (
//     <div
//       className="relative"
//       style={{
//         width: size,
//         height: size / 2 + strokeWidth,
//       }}
//     >
//       <svg
//         width={size}
//         height={size / 2 + strokeWidth}
//         viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}
//         className="block mx-auto"
//       >
//         <path
//           d={`M${strokeWidth / 2},${radius + strokeWidth / 2} A${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${
//             radius + strokeWidth / 2
//           }`}
//           fill="none"
//           stroke="#e5e7eb"
//           strokeWidth={strokeWidth}
//         />

//         <path
//           d={`M${strokeWidth / 2},${radius + strokeWidth / 2} A${radius},${radius} 0 0,1 ${size - strokeWidth / 2},${
//             radius + strokeWidth / 2
//           }`}
//           fill="none"
//           stroke="#37137f"
//           strokeWidth={strokeWidth}
//           strokeLinecap="round"
//           strokeDasharray={circumference}
//           strokeDashoffset={offset}
//           style={{
//             transition: "stroke-dashoffset 0.5s ease-in-out",
//           }}
//         />
//       </svg>
//       {/* Render custom children */}
//       <div
//         className="absolute top-0 left-0 flex flex-col space-y-2 items-center justify-center"
//         style={{
//           width: size,
//           height: size / 2,
//           transform: `translateY(${strokeWidth / 2}px)`,
//         }}
//       >
//         {children}
//       </div>
//     </div>
//   );
// };
