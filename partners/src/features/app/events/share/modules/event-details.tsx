import { useParams } from "@tanstack/react-router";
import { useEventDetailsQuery } from "../../hooks/query";
import { Event } from "@/modules/units/card/event";
import { Fragment } from "react/jsx-runtime";
import { SemiCircleProgressBar } from "../../detail/modules/info";
import { formatCurrency } from "@/helpers/text";
import { useCountdown } from "../hooks/logic";

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
    event.fundRaiser.fundRaised >= 1
      ? true
      : false;

  return (
    <div className="px-3.5 w-full pb-20">
      <div className="flex flex-col w-full h-full bg-white rounded-t-2xl space-y-5 pb-20">
        {event && (
          <Fragment>
            <Event
              className="rounded-b-none min-h-64"
              availableTickets={event.eventTicket.availableTickets || 0}
              key={event._id}
              id={event._id}
              thumbnail={event.photo}
              title={event.name}
              date={event.endTime}
              price={event.minimumPledge || 0}
              location={event.address}
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
              <p className="text-white text-xs font-bold">{event.admin.name}</p>
            </div>

            {isFundraiser ? (
              <div className="flex flex-col items-center justify-center w-full space-y-0.5">
                <h1 className="text-primary font-extrabold">Minimum Pledge</h1>
                <p className="text-xs font-medium text-primary/50">
                  Funds needed to make a difference.
                </p>
                <SemiCircleProgressBar
                  value={event.eventPledge.totalPledgedAmount}
                  size={300}
                >
                  <h2 className="text-2xl font-bold text-primary">
                    {formatCurrency(event.minimumPledge)}
                  </h2>
                  <span className="text-sm px-2.5 py-1 rounded-lg bg-teal-500/15 text-teal-600 font-semibold inline-flex">
                    {event.eventPledge.totalPledgedAmount}%
                  </span>{" "}
                </SemiCircleProgressBar>
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
                          <h1 className="text-[44px] font-black text-primary">
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
