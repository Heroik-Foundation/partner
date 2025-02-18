import { authenticatedInstance } from "@/lib/axios";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import type {
  Channel,
  Charity,
  Event,
  NestedPaginatedResponse,
  PaginatedResponse,
  User,
} from "../types";

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
    staleTime: 5 * 60 * 1000,
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
    staleTime: 5 * 60 * 1000,
    retry: 5,
    enabled: userId !== undefined,
  });
}

// Infinite Queries

export function useUserEventsQuery(props: QueryProps) {
  const { userId, searchQuery } = props;

  return useInfiniteQuery({
    queryKey: ["user-events", searchQuery, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Event, "events">
      >(`/event-partners/events/${userId}`, {
        params: {
          page: pageParam,
          searchQuery,
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
    staleTime: 5 * 60 * 1000,
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
