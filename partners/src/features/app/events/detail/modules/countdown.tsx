"use client";

import { useCountdown } from "../../share/hooks/logic";

export const EventCountdown = ({ startDate }: { startDate: string }) => {
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
    <div className="flex flex-col items-start justify-center space-y-2.5">
      <span className="py-1 px-2.5 bg-primary/15 text-primary text-sm font-extrabold rounded-lg w-fit mx-auto">
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
  );
};
