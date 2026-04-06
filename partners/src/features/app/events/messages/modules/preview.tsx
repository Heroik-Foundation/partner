import {
  useConversationsQuery,
  useUserPropertiesQuery,
} from "@/features/app/global/hooks/query";
import { truncateText } from "@/helpers/text";
import { getReadableTime } from "@/helpers/time";
import { useIntersectionObserver } from "@/hooks/observer";
import { cn } from "@/lib/utils";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { Link, useParams } from "@tanstack/react-router";
import { UserCircle2Icon } from "lucide-react";
import { Fragment } from "react";

export const Previews = ({ searchQuery }: { searchQuery: string }) => {
  const { id } = useParams({
    strict: false,
  });
  const { data: currentUser } = useUserPropertiesQuery();

  const { data, isPending, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useConversationsQuery({
      searchQuery,
      eventId: id,
    });

  const rows = data?.pages || [];

  const lastConversationRef = useIntersectionObserver<HTMLAnchorElement>(
    fetchNextPage,
    [hasNextPage],
  );

  const noConversationsFound =
    rows.length < 1 && !isPending && !isFetchingNextPage;

  const currentEventPartnerId = currentUser?._id;

  return (
    <div className="space-y-5">
      {rows.map((preview, index, list) => {
        const participant = !currentEventPartnerId
          ? preview.participants[1]
          : preview.participants.find(
              (user: any) => user.participant._id !== currentEventPartnerId,
            );

        const seen =
          preview.lastMessage.sender === currentEventPartnerId
            ? true
            : preview.lastMessage.sender !== currentEventPartnerId &&
                preview.lastMessage.status === "read"
              ? true
              : false;

        if (participant) {
          return (
            <Link
              to="/app/events/$id/messages/$id"
              key={index}
              className="flex items-center justify-between cursor-pointer"
              params={{
                id: String(preview._id),
              }}
              ref={list.length - 1 === index ? lastConversationRef : undefined}
            >
              <div className="flex items-center space-x-2">
                {participant.participant.logo ||
                participant.participant.photo ? (
                  <img
                    src={
                      participant.participant.photo ||
                      participant.participant.logo
                    }
                    alt={`${participant.participant.fullname}'s Image`}
                    loading="eager"
                    className="w-10 h-10 rounded-full border-2 border-primary object-cover object-center"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full border/20 border-primary flex items-center justify-center bg-primary/10">
                    <UserCircle2Icon className="stroke-primary" />
                  </div>
                )}
                <div>
                  <h5 className="text-primary font-bold text-sm">
                    {participant.participant.fullname ||
                      participant.participant.name ||
                      "User"}
                  </h5>
                  <p className={cn("font-bold text-xs")}>
                    {truncateText(preview.lastMessage.message, 30)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <span className="font-extrabold text-[8px]">
                  {" "}
                  {getReadableTime(preview.updatedAt)}{" "}
                </span>
                {!seen && (
                  <div className="w-5 h-5 rounded-full bg-primary shadow text-white flex items-center justify-center">
                    <span className="font-black text-xs">1</span>
                  </div>
                )}
              </div>
            </Link>
          );
        }
      })}
      {(isPending || isFetchingNextPage) && (
        <Fragment>
          <ConversationPreviewSkeletonLoader />
          <ConversationPreviewSkeletonLoader />
        </Fragment>
      )}
      {noConversationsFound && (
        <ItemNotFound message="No Conversations Found" />
      )}
    </div>
  );
};

const ConversationPreviewSkeletonLoader = () => {
  return (
    <div className="flex items-center justify-between cursor-pointer animate-pulse p-2">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-gray-300" />
        <div>
          <div className="h-3 w-24 bg-gray-300 rounded mb-1" />
          <div className="h-2 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="flex flex-col items-end space-y-1">
        <span className="font-extrabold text-[8px] text-gray-300">-</span>
        <div className="w-5 h-5 rounded-full bg-gray-300 shadow flex items-center justify-center" />
      </div>
    </div>
  );
};
