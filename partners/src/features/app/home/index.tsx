import { HomeHeader } from "../global/header";

import { Actions } from "./modules/links/actions";
import { Revenue } from "./modules/links/revenue";
import { Stats } from "./modules/stats";
import Content from "./modules/links/content";
import { Event, EventSkeletonLoader } from "@/modules/units/card/event";
import {
  useUserChannelsQuery,
  useUserEventsQuery,
  useUserPropertiesQuery,
} from "../global/hooks/query";
import { Channel, ChannelSkeletonLoader } from "@/modules/units/card/channel";

const Home = () => {
  const { data: user } = useUserPropertiesQuery();
  const { data: events } = useUserEventsQuery({ userId: user?._id });
  const { data: channels } = useUserChannelsQuery({ userId: user?._id });

  const event = events && events.pages[0];
  const channel = channels && channels.pages[0];

  return (
    <div className="space-y-5 relative min-h-screen pb-16">
      <HomeHeader />
      <Stats />
      <Revenue />
      <Actions />
      <Content type="event">
        {event ? (
          <Event
            id={event._id}
            thumbnail={event.photo}
            title={event.name}
            date={event.endTime}
            price={event.eventTicket.ticketPrice || 0}
            location={event.address}
          />
        ) : (
          <EventSkeletonLoader />
        )}
      </Content>
      <Content type="channel">
        {channel ? (
          <Channel
            id={channel._id}
            thumbnail={channel.photo}
            title={channel.name}
            description={channel.description}
            members={channel.members.length}
            avatars={channel.members.map((member) => member.photo)}
          />
        ) : (
          <ChannelSkeletonLoader />
        )}
      </Content>
    </div>
  );
};

export default Home;
