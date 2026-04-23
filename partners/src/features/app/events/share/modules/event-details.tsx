import { useParams } from "@tanstack/react-router";
import { useEventDetailsQuery } from "../../hooks/query";
import { Event } from "@/modules/units/card/event";
import { Fragment } from "react/jsx-runtime";
import { useCountdown } from "../hooks/logic";
import { toast } from "sonner";

import eyeIcon from "@/features/app/events/detail/assets/eye.svg";
import { formatCurrency } from "@/helpers/text";

export const EventDetails = () => {
  const { id } = useParams({
    strict: false,
  });
  const { data: event } = useEventDetailsQuery({ id });
  const { days, hours, minutes, seconds } = useCountdown(event?.endTime || "");

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

  const isFundraiser =
    event &&
    event.fundRaiser.organizations.length >= 1 &&
    event.fundRaiser.fundRaised >= 1;

  const minimumPledge = event?.eventPledge.minimumPledge || 0;

  return (
    <div className="px-3.5 w-full pb-20 h-full">
      <div className="flex flex-col w-full h-full bg-white rounded-t-2xl space-y-5 pb-20">
        {event && (
          <Fragment>
            <Event
              currency={event.currency}
              className="rounded-b-none min-h-64"
              key={event._id}
              id={event._id}
              thumbnail={event.photo || ""}
              title={event.name}
              date={event.endTime}
              price={
                event.ticketing?.length > 0
                  ? Math.min(...event.ticketing.map((t) => t.ticketPrice ?? 0))
                  : 0
              }
              hasMultipletTickets={event.ticketing.length > 1}
              {...(event.meetingLink
                ? { meetingLink: event.meetingLink || "" }
                : { location: event.address || "" })}
            />
            <div className="flex flex-col items-center justify-center space-y-2.5">
              <span className="py-2 px-5 bg-primary/15 text-primary text-xs font-extrabold rounded-lg">
                About Event
              </span>
              <p className="text-xs font-medium text-center text-primary px-2.5">
                {event.description}
              </p>
            </div>

            <div className="bg-primary/75 px-5 py-2.5 flex flex-col items-center justify-center mx-5 rounded-xl space-y-1.5">
              <span className="bg-primary text-white font-bold py-2 px-5 text-xs rounded-lg">
                Event Host
              </span>
              <p className="text-white text-xs font-bold">
                {event.admin?.name || ""}
              </p>
            </div>

            {isFundraiser ? (
              <div className="flex items-start justify-around">
                <div className="space-y-2.5 flex flex-col items-center">
                  <h5 className="text-sm px-2.5 py-1 rounded-lg bg-primary/15 text-primary font-extrabold inline-flex w-fit">
                    Charity Partner (s)
                  </h5>
                  <button
                    onClick={() => {
                      toast.info("Login to see this event's partners");
                    }}
                    className="font-bold text-xs rounded-full bg-primary py-4 px-5 w-fit mx-auto text-white inline-flex items-center space-x-2.5"
                  >
                    <span> View Charity Partners</span>{" "}
                    <img src={eyeIcon} alt="" />
                  </button>
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
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2.5">
                <span className="py-2 px-5 bg-primary/15 text-primary text-xs font-extrabold rounded-lg">
                  Event Countdown
                </span>

                <div className="flex items-center space-x-2.5">
                  {countdown.map((measure, index) => {
                    return (
                      <div
                        key={index}
                        className="space-y-5 flex flex-col justify-center items-center"
                      >
                        <div className="bg-primary/30 p-2.5 rounded-lg">
                          <h1 className="text-base sm:text-[44px] sm:py-5 font-black text-primary">
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
            )}
          </Fragment>
        )}
      </div>
    </div>
  );
};
