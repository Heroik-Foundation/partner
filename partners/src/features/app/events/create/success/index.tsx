import { useParams, useRouter } from "@tanstack/react-router";
import { useEventDetailsQuery } from "../../hooks/query";
import { Button } from "@/modules/ui/button";
import { Event, EventSkeletonLoader } from "@/modules/units/card/event";
import { Share } from "lucide-react";

const EventCreationSuccess = () => {
  const { id } = useParams({
    strict: false,
  });
  const { navigate } = useRouter();
  const { data: event } = useEventDetailsQuery({ id });

  return (
    <div className="space-y-20 pt-10">
      <div className="space-y-5">
        <div className="text-primary space-y-1.5 text-center">
          <h2 className="text-2xl font-black">🎉 Cheers 🎉</h2>
          <p className="font-medium text-xl">
            You have successfully created your event
          </p>
          <h1 className="text-xl font-black">{event?.name || "Event Name"}</h1>
        </div>

        <div>
          {event ? (
            <Event
              key={event._id}
              id={event._id}
              thumbnail={event.photo}
              title={event.name}
              date={event.endTime}
              price={event.minimumPledge || 0}
              location={event.address}
            />
          ) : (
            <EventSkeletonLoader />
          )}
        </div>
      </div>

      <div className="flex flex-col space-y-2.5">
        <Button
          onClick={() => {
            navigate({
              to: "/app/events/$id",
              params: {
                id: String(id),
              },
            });
          }}
          size="lg"
          className="primary-box-shadow"
        >
          View Event
        </Button>
        <Button size="lg" variant="outline">
          <span>Share Event </span>
          <Share />
        </Button>
      </div>
    </div>
  );
};

export default EventCreationSuccess;
