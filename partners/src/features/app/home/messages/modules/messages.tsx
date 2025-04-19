import { useConversationsQuery } from "@/features/app/global/hooks/query";
import { truncateText } from "@/helpers/text";
import { getReadableTime } from "@/helpers/time";
import { useIntersectionObserver } from "@/hooks/observer";
import { Button } from "@/modules/ui/button";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { useRouter } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Messages = ({ searchQuery }: { searchQuery: string }) => {
  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useConversationsQuery({
      searchQuery,
    });

  const { navigate } = useRouter();

  const rows = data?.pages || [];

  const lastConversationRef = useIntersectionObserver<HTMLDivElement>(
    fetchNextPage,
    [hasNextPage]
  );

  const noConversationsFound =
    rows.length < 1 && !isPending && !isFetchingNextPage;

  return (
    <div>
      {rows.map((message, index, list) => {
        const eventId = message.participants[0].event._id;
        const eventName = message.participants[0].event.name;
        const eventLogo = message.participants[0].event.photo;

        return (
          <div
            ref={list.length - 1 === index ? lastConversationRef : undefined}
            className="flex items-center py-4 justify-between"
            key={index}
          >
            <div className="space-x-1.5 flex items-center">
              <img
                src={eventLogo}
                className="w-8 h-8 rounded-full object-cover object-center"
              />
              <div className="flex flex-col items-center">
                <span className="text-primary text-xs font-bold">
                  {truncateText(eventName, 15)}
                </span>
                <span className="text-primary/50 text-[10px] font-bold">
                  {getReadableTime(message.createdAt)}
                </span>
              </div>
            </div>

            <Button
              className="rounded-full"
              variant="secondary"
              onClick={() => {
                navigate({
                  to: "/app/events/$id/messages",
                  params: {
                    id: String(eventId),
                  },
                });
              }}
              size="sm"
            >
              View Chats
            </Button>
          </div>
        );
      })}
      {(isPending || isFetchingNextPage) && (
        <Fragment>
          <EventMessageSkeletonLoader />
          <EventMessageSkeletonLoader />
        </Fragment>
      )}
      {noConversationsFound && (
        <ItemNotFound message="No Event Messages Found" />
      )}
    </div>
  );
};

const EventMessageSkeletonLoader = () => {
  return (
    <div className="flex items-center py-4 justify-between animate-pulse">
      <div className="space-x-1.5 flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-300" />
        <div className="flex flex-col items-center space-y-1">
          <div className="w-16 h-3 bg-gray-300 rounded" />
          <div className="w-12 h-2 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="w-20 h-5 bg-gray-300 rounded-full" />
    </div>
  );
};
