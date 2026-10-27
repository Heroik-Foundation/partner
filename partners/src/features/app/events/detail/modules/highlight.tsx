import { formatISODate } from "@/helpers/time";
import { cn } from "@/lib/utils";
import { DetailProps, EventProps } from "@/modules/units/card/event";
import { Calendar, Clock, MapPin, Video } from "lucide-react";

import ticketIcon from "../assets/ticket.svg";
import { ActionDialog } from "@/modules/units/page/action";
import { Button } from "@/modules/ui/button";
import { extractMeetingLink } from "@/helpers/text";

type HighlightProps = {
  members?: number;
  avatars?: string[];
  availableTickets: number;
} & Omit<EventProps, "price" | "nodeRef" | "id">;

export const Highlight = (props: HighlightProps) => {
  const { title, date, thumbnail, avatars, members, availableTickets } = props;
  const { date: relativeDate, time: relativeTime } = formatISODate(date);
  const imageURL = thumbnail === "" ? "/image/input-preview.jpg" : thumbnail;

  console.log(thumbnail);


  const hasAttendees = (members || 0) > 0 && (avatars || []).length > 0;

  return (
    <div className="lg:relative">
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
        <div
          className={cn(
            props.meetingLink && "flex items-center justify-between",
          )}
        >
          <EventDetail
            icon={MapPin}
            content={
              props.meetingLink
                ? "Online"
                : props.location
                  ? props.location
                  : ""
            }
          />

          {props.meetingLink && (
            <ActionDialog
              title="Meeting Details"
              description={`${props.meetingLink}`}
              trigger={
                <Button size={"sm"} variant={"accent"} className="w-fit">
                  <Video /> View Details
                </Button>
              }
              callback={{
                fn: () => {
                  const safeUrl = extractMeetingLink(props.meetingLink || "");
                  window.open(safeUrl, "_blank", "noopener,noreferrer");
                },
                title: "Open Link",
              }}
            />
          )}
        </div>
        <div className="flex space-x-2.5 justify-between">
          <EventDetail icon={Calendar} content={relativeDate} />
          <EventDetail icon={Clock} content={relativeTime} />
        </div>
        <div
          className={cn(
            "w-full flex items-center justify-between space-x-2.5 md:space-x-4",
            !hasAttendees && "justify-center",
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
              "flex items-center space-x-1",
              !hasAttendees && "justify-center",
            )}
          >
            <img src={ticketIcon} alt="" className="w-2.5" />
            <span className="font-extrabold text-xs whitespace-nowrap md:text-sm">
              {availableTickets > 0 ? ` ` : ""}Tickets
              available
            </span>
          </div>
        </div>
      </div>
      <div
        className="pb-64
        md:pb-72
        lg:pb-[450px]"
      />
    </div>
  );
};

const EventDetail = (props: DetailProps) => {
  return (
    <div
      className="flex items-start space-x-1 font-semibold text-sm
      md:space-x-2 md:text-base"
    >
      <div
        className="w-4 h-4 min-w-4
        md:w-5 md:h-5 md:min-w-4"
      >
        <props.icon className="fill-primary stroke-white" size="100%" />
      </div>
      <span>{props.content}</span>
    </div>
  );
};
