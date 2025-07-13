import { api } from "@/lib/axios";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Event } from "@/components/table/columns/event";

export type TimeFrame = "past" | "present" | "future" | "";

export function useAllEvents({ time }: { time: TimeFrame }) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["all-events", time],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(
        `/events/all-events?page=${pageParam}&timeFilter=${time}`,
        {
          admin: false,
          authenticated: true,
        }
      );

      return data.events;
    },
    getNextPageParam: (lastPage) => {
      const nextPage =
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.currentPage + 1
          : null;

      return nextPage;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => page.data),
    }),
    initialData: () => {
      const queryCacheData = queryClient.getQueryState(["all-events"])?.data;
      if (queryCacheData) {
        return {
          pageParams: [undefined, 1],
          pages: [queryCacheData],
        };
      }
    },
    initialPageParam: 1,
  });
}

export function useEventDonations({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["event-donations", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get(
        `/events/${id}/donations?page=${pageParam}`,
        {
          admin: false,
          authenticated: true,
        }
      );

      return data.event;
    },
    getNextPageParam: (lastPage) => {
      const nextPage =
        lastPage.currentPage !== lastPage.totalPages
          ? lastPage.currentPage + 1
          : null;

      return nextPage;
    },
    select: (data) => ({
      ...data,
      pages: data.pages.map((page) => page.data),
    }),
    initialData: () => {
      const queryCacheData = queryClient.getQueryState(["all-events"])?.data;
      if (queryCacheData) {
        return {
          pageParams: [undefined, 1],
          pages: [queryCacheData],
        };
      }
    },
    initialPageParam: 1,
  });
}

export function useEventById({ id }: { id: string }) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await api.get(`/events/${id}`, {
        admin: false,
        authenticated: true,
      });

      return data.event as Event;
    },
  });
}
