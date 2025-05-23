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
import { Button } from "@/modules/ui/button";

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

      <div className="space-x-2.5">
        {["past", "present", "future"].map((value, index) => {
          const isActive = filter === value;
          return (
            <Button
              variant={isActive ? "default" : "outline"}
              key={index}
              onClick={() => {
                setFilter(value as any);
              }}
            >
              <p className="first-letter:uppercase">{value}</p>
            </Button>
          );
        })}
      </div>

      {events && (
        <div className="space-y-5 flex flex-col">
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
              price={event.eventPledge.minimumPledge || 0}
              location={event.address}
            />
          ))}
        </div>
      )}
      {isFetching && (
        <Fragment>
          <EventSkeletonLoader />
          <EventSkeletonLoader />
        </Fragment>
      )}
      {events && events?.pages.length < 1 && !isFetching && <EventNotFound />}
    </div>
  );
};

export default AllEvents;
