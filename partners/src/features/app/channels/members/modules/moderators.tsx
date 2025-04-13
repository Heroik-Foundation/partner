import { useParams } from "@tanstack/react-router";
import { useChannelModeratorsListQuery } from "../hooks/query";
import { useIntersectionObserver } from "@/hooks/observer";
import { ChannelMember, ChannelMemberLoader } from "./member";
import { Fragment } from "react/jsx-runtime";
import { Member } from "@/features/app/global/types";

export const ChannelModerators = () => {
  const { id } = useParams({ strict: false });
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useChannelModeratorsListQuery({
      id: String(id),
    });

  const lastMemberRef = useIntersectionObserver(fetchNextPage, [hasNextPage]);
  const rows: Member[] = data?.pages || [];

  return (
    <div className="space-y-3.5">
      <h5 className="text-xs font-bold text-primary/50">Moderators</h5>
      {rows.map((member, index, list) => {
        return (
          <ChannelMember
            key={index}
            {...member}
            nodeRef={list.length - 1 === index ? lastMemberRef : undefined}
            isModerator={true}
          />
        );
      })}
      {(isPending || isFetchingNextPage) && (
        <Fragment>
          <ChannelMemberLoader />
          <ChannelMemberLoader />
          <ChannelMemberLoader />
        </Fragment>
      )}
    </div>
  );
};
