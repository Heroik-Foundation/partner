import { formatISODate } from "@/helpers/time";
import { DetailProps, EventProps } from "@/modules/ui/units/card/event";
import { Calendar, Clock, Pin } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type HighlightProps = {
  members: number;
  avatars: string[];
} & Omit<EventProps, "price" | "nodeRef" | "id">;

export const Highlight = (props: HighlightProps) => {
  const { title, date, location, thumbnail, avatars, members } = props;
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
          <h1 className="font-bold text-sm">{title}</h1>
          <EventDetail icon={Pin} content={location} />
          <div className="flex space-x-2.5 justify-between">
            <EventDetail icon={Calendar} content={relativeDate} />
            <EventDetail icon={Clock} content={relativeTime} />
          </div>
          <div className="w-full flex items-center justify-center">
            <div className="bg-primary/15 p-2 rounded-full inline-flex space-x-2 items-center">
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
          </div>
        </div>
        <div className="pb-64" />
      </Fragment>
    </Fragment>
  );
};

const EventDetail = (props: DetailProps) => {
  return (
    <div className="flex items-center space-x-1 font-semibold text-sm">
      <props.icon className="fill-primary stroke-gray-500" size="16" />
      <span>{props.content}</span>
    </div>
  );
};
