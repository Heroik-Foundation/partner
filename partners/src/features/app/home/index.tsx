import { HomeHeader } from "../global/header";

import { Actions } from "./modules/links/actions";
import { Stats } from "./modules/stats";
import Content from "./modules/links/content";
import {
  Event,
  EventNotFound,
  EventSkeletonLoader,
} from "@/modules/units/card/event";
import {
  useUserChannelsQuery,
  useUserEventsQuery,
  useUserPropertiesQuery,
} from "../global/hooks/query";
import { Channel, ChannelSkeletonLoader } from "@/modules/units/card/channel";
import { Carousel, CarouselContent, CarouselItem } from "@/modules/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Home = () => {
  const { data: user } = useUserPropertiesQuery();

  const { data: presentEvents, isPending: isFetchingPresentEvents } =
    useUserEventsQuery({
      userId: user?._id,
      eventFilter: "present",
    });

  const { data: futureEvents, isPending: isFetchingFutureEvents } =
    useUserEventsQuery({
      userId: user?._id,
      eventFilter: "future",
    });

  const { data: channels } = useUserChannelsQuery({ userId: user?._id });

  const events_list =
    presentEvents && futureEvents
      ? [...presentEvents.pages, ...futureEvents.pages].slice(0, 6)
      : undefined;

  const channel = channels && channels.pages[0];

  return (
    <div className="space-y-5 relative min-h-screen pb-16">
      <HomeHeader />
      <Stats />
      <Actions />
      <Content type="event">
        {events_list && events_list.length >= 1 && (
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="w-full -ml-0">
              {events_list.map((event, index) => (
                <CarouselItem key={index} className="w-full basis-full pl-0.5">
                  <Event
                    id={event._id}
                    thumbnail={event.photo || ""}
                    title={event.name}
                    date={event.endTime}
                    price={event.ticketing[0].ticketPrice || 0}
                    location={event.address}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {(isFetchingFutureEvents || isFetchingPresentEvents) && (
          <EventSkeletonLoader />
        )}

        {events_list &&
          events_list.length < 1 &&
          !isFetchingFutureEvents &&
          !isFetchingPresentEvents && <EventNotFound />}
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
