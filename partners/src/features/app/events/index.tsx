import { Fragment, useState } from "react";
import { SearchInput } from "../global/form";
import { Header } from "../global/header";
import {
  useUserEventsQuery,
  useUserPropertiesQuery,
} from "../global/hooks/query";
import {
  Event,
  EventNotFound,
  EventSkeletonLoader,
} from "@/modules/units/card/event";
import { useIntersectionObserver } from "@/hooks/observer";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const AllEvents = () => {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<"past" | "present" | "future">(
    "present"
  );
  const { data: user } = useUserPropertiesQuery();
  const {
    data: events,
    isFetching,
    fetchNextPage,
    hasNextPage,
  } = useUserEventsQuery({
    searchQuery: query.toLowerCase(),
    userId: user?._id,
    eventFilter: filter,
  });

  const lastEventRef = useIntersectionObserver(fetchNextPage, [hasNextPage]);

  return (
    <div className="space-y-5 min-h-screen">
      <Header
        header={{
          position: "inline",
          title: "My Events",
        }}
      />
      <SearchInput
        placeholder="Search for Events..."
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
      />

      <div className="flex items-center justify-between w-full bg-primary/10 rounded-xl p-0.5">
        {["present", "future", "past"].map((value, index) => {
          const isActive = filter === value;
          return (
            <button
              className={cn(
                "relative w-full p-4 text-primary transition-all",
                isActive && "text-white"
              )}
              key={index}
              onClick={() => {
                setFilter(value as any);
              }}
            >
              <p className="first-letter:uppercase relative z-10 font-semibold">
                {value === "present"
                  ? "Ongoing"
                  : value === "future"
                    ? "Upcoming"
                    : value}
              </p>

              {isActive && (
                <motion.div
                  layoutId="active-event-tab-pill"
                  className="absolute inset-0 bg-primary rounded-xl"
                />
              )}
            </button>
          );
        })}
      </div>

      {events && (
        <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {events.pages.map((event, index, all_events) => (
            <Event
              {...(all_events.length - 1 === index && {
                nodeRef: lastEventRef,
              })}
              key={event._id}
              id={event._id}
              thumbnail={event.photo}
              title={event.name}
              date={event.endTime}
              price={event.eventTicket.ticketPrice || 0}
              location={event.address}
            />
          ))}

          {isFetching && (
            <Fragment>
              <EventSkeletonLoader />
              <EventSkeletonLoader />
            </Fragment>
          )}
        </div>
      )}

      {events && events?.pages.length < 1 && !isFetching && <EventNotFound />}
    </div>
  );
};

export default AllEvents;
