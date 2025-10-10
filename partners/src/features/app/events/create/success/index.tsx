import { useParams, useRouter, useRouterState } from "@tanstack/react-router";
import { useEventDetailsQuery } from "../../hooks/query";
import { Button } from "@/modules/ui/button";
import { Event, EventSkeletonLoader } from "@/modules/units/card/event";
import { Share } from "lucide-react";
import { useRouteStore } from "@/hooks/router";
import { ShareDialog } from "@/modules/units/page/share";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { useEffect } from "react";
import { useMapStore } from "@/stores/maps";

const EventCreationSuccess = () => {
  const { id } = useParams({
    strict: false,
  });
  const { reset } = useEventFormStore();
  const { resetStore } = useMapStore();
  const pathname = useRouterState().location.pathname;
  const { setPath } = useRouteStore();
  const { navigate } = useRouter();
  const { data: event } = useEventDetailsQuery({ id });

  const handleFormReset = () => {
    reset();
    resetStore();
    setPath(pathname);
  };

  useEffect(() => {
    handleFormReset();

    return () => {
      handleFormReset();
    };
  }, []);

  return (
    <div className="space-y-20 pt-10 relative">
      <div className="space-y-5 flex flex-col">
        <div className="text-primary space-y-1.5 text-center">
          <h2 className="text-2xl font-black">🎉 Cheers 🎉</h2>
          <p className="font-medium text-xl">
            You have successfully created your event
          </p>
          <h1 className="text-xl font-black">{event?.name || "Event Name"}</h1>
        </div>

        {event ? (
          <Event
            className="block"
            key={event._id}
            id={event._id}
            thumbnail={event.photo || ""}
            title={event.name}
            date={event.endTime}
            price={event.ticketing[0].ticketPrice}
            location={event.address}
          />
        ) : (
          <EventSkeletonLoader />
        )}
      </div>

      <div className="flex flex-col space-y-2.5">
        <Button
          onClick={() => {
            setPath(pathname);
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
        <ShareDialog
          dialogTitle="Share this event"
          title={event?.name}
          description={event?.description}
          url={`https://events.hiroek.io/event/${event?._id}`}
          trigger={
            <Button size="lg" variant="outline">
              <span>Share Event </span>
              <Share />
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default EventCreationSuccess;
