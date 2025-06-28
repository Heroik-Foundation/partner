import { Link } from "@tanstack/react-router";
import { Calendar, Clock, MapPin, Ticket, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatISODate } from "@/helpers/time";
import { formatCurrency } from "@/helpers/text";

export type EventProps = {
  id: string;
  title: string;
  date: string;
  price: number;
  location: string;
  thumbnail: string;
  nodeRef?: any;
  className?: string;
  availableTickets?: number;
};

export type DetailProps = {
  icon: LucideIcon;
  content: string;
};

export const Event = (props: EventProps) => {
  const {
    id,
    title,
    date,
    price,
    location,
    thumbnail,
    nodeRef,
    className,
    availableTickets,
  } = props;
  const { date: relativeDate, time: relativeTime } = formatISODate(date);

  return (
    <Link
      to="/app/events/$id"
      params={{
        id,
      }}
      className={cn(
        "rounded-2xl bg-cover relative block min-h-64 sm:min-h-80",
        className
      )}
      style={{
        background: `url('${thumbnail}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundColor: "rgb(55 19 127 / 0.1)",
      }}
      ref={nodeRef}
    >
      <div className="absolute rounded-full px-4 py-1.5 text-accent font-black top-5 right-5 bg-white text-sm">
        {formatCurrency(price)}
      </div>

      <div className="p-4 bg-white text-primary absolute rounded-xl space-y-2.5 left-0 right-0 bottom-5 mx-auto w-[90%]">
        <p className="font-bold text-sm first-letter:uppercase">{title}</p>
        <EventDetail icon={MapPin} content={location} />
        <div className="flex space-x-2.5">
          <EventDetail icon={Calendar} content={relativeDate} />
          <EventDetail icon={Clock} content={relativeTime} />
        </div>
        {availableTickets && (
          <EventDetail
            icon={Ticket}
            content={`${availableTickets} Spots Available`}
          />
        )}
      </div>
    </Link>
  );
};

export const EventSkeletonLoader = () => {
  return <div className="w-full h-64 rounded-2xl bg-gray-300 animate-pulse" />;
};

export const EventNotFound = () => {
  return (
    <div className="flex items-center justify-center bg-red-100 text-red-500 rounded-2xl h-64">
      <span className="text-sm font-semibold">Event Not Found</span>
    </div>
  );
};

const EventDetail = ({ icon, content }: DetailProps) => {
  const Icon = icon;
  return (
    <div className="flex items-start space-x-1 font-semibold text-xs">
      <div
        style={{
          width: "16px",
          height: "16px",
        }}
      >
        <Icon className="fill-primary stroke-white" size={16} />
      </div>
      <span>{content}</span>
    </div>
  );
};
