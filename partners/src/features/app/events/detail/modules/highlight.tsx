import { formatISODate } from "@/helpers/time";
import { cn } from "@/lib/utils";
import { DetailProps, EventProps } from "@/modules/units/card/event";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type HighlightProps = {
  members?: number;
  avatars?: string[];
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
  const imageURL = thumbnail === "" ? "/image/input-preview.jpg" : thumbnail;

  const hasAttendees = (members || 0) > 0 && (avatars || []).length > 0;

  return (
    <Fragment>
      <div
        className="absolute -top-20 rounded-b-xl w-full left-0 right-0 max-w-lg mx-auto
        md:-top-24 md:max-w-2xl
        lg:-top-28 lg:max-w-4xl
        xl:-top-32 xl:max-w-6xl"
      >
        <img
          className="w-full h-[350px] rounded-b-2xl object-cover
            md:h-[400px]
            lg:h-[450px]
            xl:h-[500px]"
          src={imageURL}
          alt={title}
        />
      </div>
      <div
        className="p-4 bg-white text-primary absolute rounded-3xl space-y-2.5 left-0 right-0 top-40 shadow-lg mx-auto w-[90%] max-w-md
        md:top-48 md:max-w-xl
        lg:top-56 lg:max-w-2xl
        xl:top-64 xl:max-w-3xl"
      >
        <p
          className="font-bold text-sm first-letter:uppercase
          md:text-base
          lg:text-lg"
        >
          {title}
        </p>
        <EventDetail icon={MapPin} content={location} />
        <div className="flex space-x-2.5 justify-between">
          <EventDetail icon={Calendar} content={relativeDate} />
          <EventDetail icon={Clock} content={relativeTime} />
        </div>
        <div
          className={cn(
            "w-full flex items-center justify-between space-x-2.5 md:space-x-4",
            !hasAttendees && "justify-center"
          )}
        >
          {hasAttendees && (
            <div className="bg-primary/15 py-2.5 px-4 rounded-full flex space-x-2 items-center md:py-3 md:px-5">
              <div className="flex -space-x-2">
                {avatars
                  ?.slice(0, 3)
                  .map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="Avatar"
                      className="w-5 h-5 rounded-full object-fill border-2 border-white md:w-6 md:h-6"
                    />
                  ))}
              </div>
              <span className="text-xs font-bold md:text-sm">
                {members} Attending
              </span>
            </div>
          )}

          <div
            className={cn(
              "flex items-start space-x-1",
              !hasAttendees && "justify-center"
            )}
          >
            <Ticket size={14} className="md:w-4 md:h-4" />
            <span className="font-extrabold text-xs whitespace-nowrap md:text-sm">
              {availableTickets > 0 ? `${availableTickets} ` : ""}Spots
              available
            </span>
          </div>
        </div>
      </div>
      <div
        className="pb-64
        md:pb-72
        lg:pb-80
        xl:pb-96"
      />
    </Fragment>
  );
};

const EventDetail = (props: DetailProps) => {
  return (
    <div
      className="flex items-start space-x-1 font-semibold text-sm
      md:space-x-2 md:text-base"
    >
      <div
        className="w-4 h-4
        md:w-5 md:h-5"
      >
        <props.icon className="fill-primary stroke-white" size="100%" />
      </div>
      <span>{props.content}</span>
    </div>
  );
};
