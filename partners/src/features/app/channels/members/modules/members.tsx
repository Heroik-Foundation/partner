import { useParams } from "@tanstack/react-router";
import {
  useChannelMembersListQuery,
  useChannelModeratorsListQuery,
} from "../hooks/query";
import { useIntersectionObserver } from "@/hooks/observer";
import { ChannelMember, ChannelMemberLoader } from "./member";
import { Fragment } from "react/jsx-runtime";
import { Member } from "@/features/app/global/types";

export const ChannelMembers = () => {
  const { id } = useParams({ strict: false });
  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useChannelMembersListQuery({
      id: String(id),
    });

  const { data: moderators } = useChannelModeratorsListQuery({
    id: String(id),
  });

  const lastMemberRef = useIntersectionObserver(fetchNextPage, [hasNextPage]);
  const rows = data?.pages || [];

  const moderatorIds = new Set(moderators?.pages.map((mod: Member) => mod._id));

  return (
    <div className="space-y-3.5">
      <h5 className="text-xs font-bold text-primary/50">Memebers</h5>
      {rows.map((member, index, list) => {
        const isModerator = moderatorIds.has(member._id);
        if (!isModerator) {
          return (
            <ChannelMember
              key={index}
              {...member}
              nodeRef={list.length - 1 === index ? lastMemberRef : undefined}
              isModerator={moderatorIds.has(member._id)}
            />
          );
        }
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
