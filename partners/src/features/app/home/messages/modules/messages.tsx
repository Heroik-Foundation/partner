import { useConversationsQuery } from "@/features/app/global/hooks/query";
import { truncateText } from "@/helpers/text";
import { getReadableTime } from "@/helpers/time";
import { useIntersectionObserver } from "@/hooks/observer";
import { Button } from "@/modules/ui/button";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { useRouter } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

interface Participant {
  event?: {
    _id: string;
    name: string;
    photo: string;
  };
}

interface Message {
  participants: Participant[];
  createdAt: string;
}

export const Messages = ({ searchQuery }: { searchQuery: string }) => {
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useConversationsQuery({ searchQuery });

  const { navigate } = useRouter();

  const lastConversationRef = useIntersectionObserver<HTMLDivElement>(
    fetchNextPage,
    [hasNextPage]
  );

  const messages = data?.pages.flat() || [];
  const isLoading = isPending || isFetchingNextPage;
  const hasNoConversations = !isLoading && messages.length === 0;

  const renderMessage = (message: Message, index: number, list: Message[]) => {
    const participantWithEvent = message.participants.find(
      (p) => p.event?._id && p.event?.name && p.event?.photo
    );

    if (!participantWithEvent?.event) return null;

    const {
      _id: eventId,
      name: eventName,
      photo: eventLogo,
    } = participantWithEvent.event;

    return (
      <div
        ref={index === list.length - 1 ? lastConversationRef : undefined}
        className="flex items-center py-4 justify-between"
        key={`${eventId}-${index}`}
      >
        <div className="flex items-center space-x-1.5">
          <img
            src={eventLogo}
            className="w-8 h-8 rounded-full object-cover object-center"
            alt={eventName}
            loading="eager"
          />
          <div className="flex flex-col items-start">
            <span className="text-xs font-bold text-primary">
              {truncateText(eventName, 15)}
            </span>
            <span className="text-[10px] font-bold text-primary/50">
              {getReadableTime(message.createdAt)}
            </span>
          </div>
        </div>

        <Button
          className="rounded-full text-xs"
          variant="secondary"
          onClick={() =>
            navigate({
              to: "/app/events/$id/messages",
              params: { id: eventId },
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
      {messages.map(renderMessage).filter(Boolean)}

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
      <div className="flex flex-col items-center space-y-1">
        <div className="w-16 h-3 rounded bg-gray-300" />
        <div className="w-12 h-2 rounded bg-gray-200" />
      </div>
    </div>
    <div className="w-20 h-5 rounded-full bg-gray-300" />
  </div>
);
