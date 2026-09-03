import { HomeHeader } from "../global/header";
import { Actions } from "./modules/links/actions";

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
import { Link } from "@tanstack/react-router";
import { BanknoteArrowUpIcon, LayoutGridIcon } from "lucide-react";
import { getActiveSession } from "@/lib/session";

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

  const { data: channels, isPending: isFetchingChannels } =
    useUserChannelsQuery({
      userId: user?._id,
    });

  const events_list =
    presentEvents && futureEvents
      ? [...presentEvents.pages, ...futureEvents.pages].slice(0, 3)
      : undefined;

  const channels_list = channels?.pages || [];

  const activeSession = getActiveSession();

  const crmLink = `https://hiroek-crm.vercel.app/auth?accessToken=${activeSession?.sessionToken}`

  return (
    <div className="space-y-5 relative min-h-screen pb-16">
      <HomeHeader />

      <div className="flex flex-col space-y-3 lg:hidden">
        <a
          href={crmLink}
          target="_blank"
          className="h-14 rounded-xl bg-accent w-full p-2 flex items-center justify-center space-x-1.5 text-xs font-extrabold text-white"
        >
          <LayoutGridIcon strokeWidth={1.7} size={18} />
          <span>View Creator Dashboard</span>
        </a>

        <Link
          to="/app/revenue"
          className="h-14 rounded-xl bg-primary w-full p-2 flex items-center justify-center space-x-1.5 text-xs font-extrabold text-white"
        >
          <BanknoteArrowUpIcon strokeWidth={1.7} size={18} />
          <span>Manage Event Revenue</span>
        </Link>
      </div>

      <Actions />

      <Content type="event">
        {events_list && events_list.length >= 1 && (
          <>
            {/* Carousel for small screens (events) */}
            <div className="block lg:hidden">
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
                    <CarouselItem
                      key={index}
                      className="w-full basis-full pl-0.5"
                    >
                      <Event
                        id={event._id}
                        thumbnail={event.photo || ""}
                        title={event.name}
                        date={event.endTime}
                        price={
                          event.ticketing?.length > 0
                            ? Math.min(
                              ...event.ticketing.map(
                                (t) => t.ticketPrice ?? 0,
                              ),
                            )
                            : 0
                        }
                        hasMultipletTickets={event.ticketing.length > 1}
                        {...(event.meetingLink
                          ? { meetingLink: event.meetingLink || "" }
                          : { location: event.address || "" })}
                        currency={event.currency}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Grid for medium and large screens (events) */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events_list.map((event, index) => (
                  <Event
                    key={index}
                    id={event._id}
                    thumbnail={event.photo || ""}
                    title={event.name}
                    date={event.endTime}
                    price={
                      event.ticketing?.length > 0
                        ? Math.min(
                          ...event.ticketing.map((t) => t.ticketPrice ?? 0),
                        )
                        : 0
                    }
                    hasMultipletTickets={event.ticketing.length > 1}
                    {...(event.meetingLink
                      ? { meetingLink: event.meetingLink || "" }
                      : { location: event.address || "" })}
                    currency={event.currency}
                  />
                ))}
              </div>
            </div>
          </>
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
        {isFetchingChannels ? (
          <ChannelSkeletonLoader />
        ) : channels_list.length > 0 ? (
          <>
            {/* Carousel for small screens (channels) */}
            <div className="block lg:hidden">
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 2000,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent className="w-full -ml-0">
                  {channels_list.map((channel, index) => (
                    <CarouselItem
                      key={index}
                      className="w-full basis-full pl-0.5"
                    >
                      <Channel
                        id={channel._id}
                        thumbnail={channel.photo}
                        title={channel.name}
                        description={channel.description}
                        members={channel.members.length}
                        avatars={channel.members.map((member) => member.photo)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Grid for medium and large screens (channels) */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {channels_list.map((channel, index) => (
                  <Channel
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
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center bg-red-100 text-red-500 rounded-2xl h-64">
            <span className="text-sm font-semibold">
              No active channel found
            </span>
          </div>
        )}
      </Content>
    </div>
  );
};

export default Home;
