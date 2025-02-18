import { Link } from "@tanstack/react-router";
import { Calendar, Clock, Pin, type LucideIcon } from "lucide-react";
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
};

export type DetailProps = {
  icon: LucideIcon;
  content: string;
};

export const Event = (props: EventProps) => {
  const { id, title, date, price, location, thumbnail, nodeRef } = props;
  const { date: relativeDate, time: relativeTime } = formatISODate(date);

  return (
    <Link
      to="/app/events/$id"
      params={{
        id,
      }}
      className={cn("rounded-2xl bg-cover relative h-64")}
      style={{
        background: `url('${thumbnail}')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      ref={nodeRef}
    >
      <div className="absolute rounded-full px-4 py-1.5 text-accent font-black top-5 right-5 bg-white text-sm">
        {formatCurrency(price)}
      </div>

      <div className="p-4 bg-white text-primary absolute rounded-xl space-y-2.5 left-0 right-0 bottom-5 mx-auto w-[90%]">
        <h1 className="font-bold text-sm">{title}</h1>
        <EventDetail icon={Pin} content={location} />
        <div className="flex space-x-2.5">
          <EventDetail icon={Calendar} content={relativeDate} />
          <EventDetail icon={Clock} content={relativeTime} />
        </div>
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
    <div className="flex items-center space-x-1 font-semibold text-xs">
      <Icon size="16" />
      <span>{content}</span>
    </div>
  );
};
