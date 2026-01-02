import { authenticatedInstance } from "@/lib/axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type {
  Channel,
  Charity,
  Conversation,
  Event,
  NestedPaginatedResponse,
  PaginatedResponse,
  User,
} from "../types";
import { timeInMinutes } from "@/helpers/time";

type QueryProps = {
  userId?: string;
  searchQuery?: string;
};

type UserPropertiesQuery = {
  eventPartner: User;
};

type PartnerStatsProps = {
  userId: string | undefined;
};

type ConversationQueryProps = {
  searchQuery?: string;
  eventId?: string;
};

type PartnerStatsQueryResponse = {
  stats: {
    eventsCreated: number;
    ticketSales: number;
    ticketSalesCount: number;
    totalCreatedCommunities: number;
    totalPledgeValue: number;
    walletBalance: number;
  };
};

// Queries

export function useUserPropertiesQuery() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get<UserPropertiesQuery>(
        "/event-partners/current-partner"
      );

      return data.eventPartner;
    },
    staleTime: timeInMinutes(60),
    retry: 5,
  });
}

export function usePartnerStatsQuery({ userId }: PartnerStatsProps) {
  return useQuery({
    queryKey: ["partner-stats"],
    queryFn: async () => {
      const { data } =
        await authenticatedInstance.get<PartnerStatsQueryResponse>(
          `/event-partners/stats/${userId}`
        );

      return data.stats;
    },
    staleTime: timeInMinutes(5),
    retry: 5,
    enabled: userId !== undefined,
  });
}

// Infinite Queries

export function useUserEventsQuery(
  props: QueryProps & {
    eventFilter?: string;
  }
) {
  const { userId, searchQuery, eventFilter } = props;

  return useInfiniteQuery({
    queryKey: ["user-events", searchQuery, userId, eventFilter],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Event, "events">
      >(`/event-partners/events/${userId}`, {
        params: {
          page: pageParam,
          searchQuery,
          eventFilter,
        },
      });
      return data;
    },
    enabled: userId !== undefined,
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.events.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.events;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });
}

export function useUserChannelsQuery(props: QueryProps) {
  const { searchQuery, userId } = props;

  return useInfiniteQuery({
    queryKey: ["user-channels", searchQuery, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Channel, "communities">
      >("/communities/all-communities", {
        params: {
          page: pageParam,
          searchQuery,
          userId,
        },
      });

      return data;
    },
    enabled: userId !== undefined,
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.communities.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.communities;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCharityOrganizationsQuery(
  props: Omit<QueryProps, "userId">
) {
  const { searchQuery } = props;

  return useInfiniteQuery({
    queryKey: ["charity-organizations", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        PaginatedResponse<Charity>
      >("/organizations", {
        params: {
          page: pageParam,
          searchQuery,
        },
      });

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useConversationsQuery(props: ConversationQueryProps) {
  const { eventId, searchQuery = "" } = props;

  return useInfiniteQuery({
    queryKey: ["user-event-conversations", searchQuery, eventId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Conversation, "conversations">
      >("/conversations", {
        params: {
          page: pageParam,
          searchQuery,
          event: eventId,
        },
      });
      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.conversations.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.conversations;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
