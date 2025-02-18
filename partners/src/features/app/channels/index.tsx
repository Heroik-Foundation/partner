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
  ChannleNotFound,
} from "@/modules/ui/units/card/channel";
import { useIntersectionObserver } from "@/hooks/observer";

const AllChannels = () => {
  const [query, setQuery] = useState<string>("");
  const { data: user } = useUserPropertiesQuery();
  const {
    data: channels,
    isFetching,
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
          title: "My Channels",
        }}
      />
      <SearchInput
        placeholder="Search for Channels..."
        value={query}
        onChange={({ target }) => {
          setQuery(target.value);
        }}
      />
      {channels && (
        <div className="space-y-5 flex flex-col">
          <h2 className="text-primary font-extrabold text-sm">All Channels</h2>
          {channels.pages.map((channel, index, all_channels) => (
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
        </div>
      )}
      {isFetching && (
        <Fragment>
          <ChannelSkeletonLoader />
          <ChannelSkeletonLoader />
        </Fragment>
      )}
      {channels && channels?.pages.length < 1 && !isFetching && (
        <ChannleNotFound />
      )}
    </div>
  );
};

export default AllChannels;
