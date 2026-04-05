import { Fragment, useState } from "react";
import { SearchInput } from "../global/form";
import {
  useUserChannelsQuery,
  useUserPropertiesQuery,
} from "../global/hooks/query";
import { Header } from "../global/header";
import {
  Channel,
  ChannelSkeletonLoader,
  ChannelNotFound,
} from "@/modules/units/card/channel";
import { useIntersectionObserver } from "@/hooks/observer";

const AllChannels = () => {
  const [query, setQuery] = useState<string>("");
  const { data: user } = useUserPropertiesQuery();
  const {
    data: channels,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useUserChannelsQuery({
    searchQuery: query.toLowerCase(),
    userId: user?._id,
  });

  const lastChannelRef = useIntersectionObserver(fetchNextPage, [hasNextPage]);

  return (
    <div className="space-y-5 min-h-screen">
      {" "}
      <Header
        header={{
          position: "inline",
          title: "Channels",
        }}
      />
      <SearchInput
        placeholder="Search for Channels..."
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
      />
      <h2 className="text-primary font-extrabold text-sm">All Channels</h2>
      <div className="gap-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {channels &&
          channels.pages.map((channel, index, all_channels) => (
            <Channel
              {...(all_channels.length - 1 === index && {
                nodeRef: lastChannelRef,
              })}
              key={index}
              id={channel._id}
              thumbnail={channel.photo}
              title={channel.name}
              description={channel.description}
              members={channel.members.length}
              avatars={channel.members.map((member) => member.photo)}
            />
          ))}

        {(isPending || isFetchingNextPage) && (
          <Fragment>
            <ChannelSkeletonLoader />
            <ChannelSkeletonLoader />
            <ChannelSkeletonLoader />
          </Fragment>
        )}
      </div>
      {channels &&
        channels?.pages.flat().length <= 1 &&
        !isPending &&
        !isFetchingNextPage && <ChannelNotFound />}
    </div>
  );
};

export default AllChannels;
