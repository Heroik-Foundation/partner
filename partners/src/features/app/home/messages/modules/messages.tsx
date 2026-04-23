import { useConversationsQuery } from "@/features/app/global/hooks/query";
import { truncateText } from "@/helpers/text";
import { getReadableTime } from "@/helpers/time";
import { useIntersectionObserver } from "@/hooks/observer";
import { Button } from "@/modules/ui/button";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { useRouter } from "@tanstack/react-router";
import { Fragment, useMemo } from "react";

// Update the interfaces to match the actual Conversation type
interface Event {
  _id: string;
  name: string;
  photo?: string; // photo can be optional/undefined
  [key: string]: unknown; // Allow other properties
}

interface Participant {
  participantType: "User" | "EventPartner";
  event?: Event;
  participant: {
    _id: string;
    createdAt: string;
    fullname?: string;
    photo?: string;
    name?: string;
    logo?: string;
  };
  name: string;
}

interface Conversation {
  participants: Participant[];
  createdAt: string;
  [key: string]: unknown;
}

interface UniqueEvent {
  event: {
    _id: string;
    name: string;
    photo?: string;
  };
  createdAt: string;
}

export const Messages = ({ searchQuery }: { searchQuery: string }) => {
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useConversationsQuery({ searchQuery });

  const { navigate } = useRouter();

  const lastConversationRef = useIntersectionObserver<HTMLDivElement>(
    fetchNextPage,
    [hasNextPage],
  );

  const conversations: Conversation[] = data?.pages.flat() || [];
  const isLoading = isPending || isFetchingNextPage;

  // Deduplicate events by event ID so each event appears only once
  const uniqueEvents: UniqueEvent[] = useMemo(() => {
    const eventMap = new Map<string, UniqueEvent>();

    conversations.forEach((conversation) => {
      const participantWithEvent = conversation.participants.find(
        (p) => p.event?._id && p.event?.name,
      );

      if (participantWithEvent?.event) {
        const eventId = participantWithEvent.event._id;

        if (!eventMap.has(eventId)) {
          // First time seeing this event
          eventMap.set(eventId, {
            event: {
              _id: participantWithEvent.event._id,
              name: participantWithEvent.event.name,
              photo: participantWithEvent.event.photo,
            },
            createdAt: conversation.createdAt,
          });
        } else {
          // Update with the most recent message time
          const existing = eventMap.get(eventId)!;
          if (new Date(conversation.createdAt) > new Date(existing.createdAt)) {
            eventMap.set(eventId, {
              event: {
                _id: participantWithEvent.event._id,
                name: participantWithEvent.event.name,
                photo: participantWithEvent.event.photo,
              },
              createdAt: conversation.createdAt,
            });
          }
        }
      }
    });

    return Array.from(eventMap.values());
  }, [conversations]);

  const hasNoConversations = !isLoading && uniqueEvents.length === 0;

  const renderEvent = (
    eventData: UniqueEvent,
    index: number,
    list: UniqueEvent[],
  ) => {
    const { event, createdAt } = eventData;

    return (
      <div
        ref={index === list.length - 1 ? lastConversationRef : undefined}
        className="flex items-center py-4 justify-between"
        key={`${event._id}-${index}`}
      >
        <div className="flex items-center space-x-1.5">
          <img
            src={event.photo || "/default-event-image.png"} // Provide a fallback image
            className="w-8 h-8 rounded-full object-cover object-center"
            alt={event.name}
            loading="eager"
            onError={(e) => {
              // Handle image load error by setting a fallback
              (e.target as HTMLImageElement).src = "/default-event-image.png";
            }}
          />
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-primary">
              {truncateText(event.name, 15)}
            </span>
            <span className="text-[10px] font-bold text-primary/50">
              {getReadableTime(createdAt)}
            </span>
          </div>
        </div>

        <Button
          className="rounded-full text-xs"
          variant="secondary"
          onClick={() =>
            navigate({
              to: "/app/events/$id/messages",
              params: { id: event._id },
            })
          }
          size="sm"
        >
          View Chats
        </Button>
      </div>
    );
  };

  return (
    <div>
      {uniqueEvents.map(renderEvent)}

      {isLoading && (
        <Fragment>
          <EventMessageSkeletonLoader />
          <EventMessageSkeletonLoader />
        </Fragment>
      )}

      {hasNoConversations && <ItemNotFound message="No Event Messages Found" />}
    </div>
  );
};

const EventMessageSkeletonLoader = () => (
  <div className="flex items-center justify-between py-4 animate-pulse">
    <div className="flex items-center space-x-1.5">
      <div className="w-8 h-8 rounded-full bg-gray-300" />
      <div className="flex flex-col items-start space-y-1">
        <div className="w-16 h-3 rounded bg-gray-300" />
        <div className="w-12 h-2 rounded bg-gray-200" />
      </div>
    </div>
    <div className="w-20 h-5 rounded-full bg-gray-300" />
  </div>
);
