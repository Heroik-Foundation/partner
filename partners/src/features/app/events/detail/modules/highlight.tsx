import { formatISODate } from "@/helpers/time";
import { DetailProps, EventProps } from "@/modules/units/card/event";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type HighlightProps = {
  members: number;
  avatars: string[];
  availableTickets: number;
} & Omit<EventProps, "price" | "nodeRef" | "id">;

export const Highlight = (props: HighlightProps) => {
  const {
    title,
    date,
    location,
    thumbnail,
    avatars,
    members,
    availableTickets,
  } = props;
  const { date: relativeDate, time: relativeTime } = formatISODate(date);

  return (
    <Fragment>
      <Fragment>
        <div className="absolute -top-20 rounded-b-xl  w-full left-0 right-0 max-w-lg mx-auto">
          <img
            className="w-full h-[350px] rounded-b-2xl object-cover"
            src={thumbnail}
          />
        </div>
        <div className="p-4 bg-white text-primary absolute rounded-3xl space-y-2.5 left-0 right-0 top-40 shadow-lg mx-auto w-[90%] max-w-md">
          <p className="font-bold text-sm first-letter:uppercase">{title}</p>
          <EventDetail icon={MapPin} content={location} />
          <div className="flex space-x-2.5 justify-between">
            <EventDetail icon={Calendar} content={relativeDate} />
            <EventDetail icon={Clock} content={relativeTime} />
          </div>
          <div className="w-full flex items-center justify-between space-x-2.5">
            <div className="bg-primary/15 py-2.5 px-4 rounded-full flex space-x-2 items-center justify-center w-full">
              <div className="flex -space-x-2">
                {avatars.slice(0, 3).map((avatar, index) => (
                  <img
                    key={index}
                    src={avatar}
                    alt="Avatar"
                    className="w-5 h-5 rounded-full object-fill border-2 border-white"
                  />
                ))}
              </div>

              <span className="text-xs font-bold">{members} Attending</span>
            </div>
            <div className="flex items-start space-x-1 w-full">
              <Ticket size={14} />{" "}
              <span className="font-extrabold text-xs whitespace-nowrap">
                {availableTickets} Spots available
              </span>
            </div>
          </div>
        </div>
        <div className="pb-64" />
      </Fragment>
    </Fragment>
  );
};

const EventDetail = (props: DetailProps) => {
  return (
    <div className="flex items-start space-x-1 font-semibold text-sm">
      <div
        style={{
          width: "16px",
          height: "16px",
        }}
      >
        <props.icon className="fill-primary stroke-white" size="16" />
      </div>
      <span>{props.content}</span>
    </div>
  );
};
