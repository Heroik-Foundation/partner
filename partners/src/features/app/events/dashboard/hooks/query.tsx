import {
  EventTicket,
  NestedPaginatedResponse,
} from "@/features/app/global/types";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type EventStatsQueryProps = {
  id?: string;
};

type EventStatsQueryResponse = {
  stats: {
    fundRaised: number;
    fundRaisingGoal: number;
    members: number;
    pledges: number;
    ticketValues: number | null;
    tickets: number | null;
    todayDonations: number;
  };
};

type EventMembersTicketPurchasesQuery = {
  eventId: string;
};

export function useEventStatsQuery({ id }: EventStatsQueryProps) {
  return useQuery({
    queryKey: ["event-stats", id],
    queryFn: async () => {
      const { data } = await authenticatedInstance.get<EventStatsQueryResponse>(
        `/events/stats/${id}`
      );

      return data.stats;
    },
  });
}

export function useEventMembersTicketPurchasesQuery({
  eventId,
}: EventMembersTicketPurchasesQuery) {
  return useInfiniteQuery({
    queryKey: ["event-members-ticket-purchases", eventId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<EventTicket, "tickets">
      >(`/events/${eventId}/tickets`, {
        params: {
          page: pageParam,
        },
      });
      return data;
    },

    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.tickets.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.tickets;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
