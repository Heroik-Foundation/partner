import { User } from "@/components/table/columns/user";
import { api } from "@/lib/axios";
import {
  QueryClient,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface Stats {
  totalPosts: 0;
  totalDonations: 0;
  totalPoints: 0;
  totalFriends: 0;
  amountRaised: 0;
}

export function useAllUsers() {
  const queryClient = new QueryClient();

  return useInfiniteQuery({
    queryKey: ["users"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(`/users?page=${pageParam}`, {
        authenticated: true,
        admin: true,
        method: "GET",
      });

      return data;
    },
    getNextPageParam: (lastPage, _) => {
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
      const queryCacheData = queryClient.getQueryState(["users"])?.data;
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

export function useUserDetails({ id }: { id: string }) {
  return useQuery({
    queryKey: ["user-details"],
    queryFn: async () => {
      const { data } = await api(`/users/${id}`, {
        authenticated: true,
        admin: false,
        method: "GET",
      });

      return data.user as User;
    },
    enabled: id !== undefined,
  });
}

export function useUserDonations({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["user-donations"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(
        `/users/${id}/donation-history?page=${pageParam}`,
        {
          method: "GET",
          admin: false,
          authenticated: true,
        }
      );

      return data.donations;
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
      const queryCacheData = queryClient.getQueryState([
        "user-donations",
      ])?.data;
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

export function useUserEvents({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["user-events", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(
        `/events?page=${pageParam}&timeFilter=""&userId=${id}`,
        {
          method: "GET",
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
      const queryCacheData = queryClient.getQueryState(["user-events"])?.data;
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

export function useUserCommunities({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["user-communities"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(
        `/communities?page=${pageParam}&userId=${id}`,
        {
          method: "GET",
          admin: true,
          authenticated: true,
        }
      );

      return data.communities;
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
      const queryCacheData = queryClient.getQueryState([
        "user-communities",
      ])?.data;
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

export function useUserStats({ id }: { id: string | undefined }) {
  return useQuery({
    queryKey: ["organization-stats"],
    queryFn: async () => {
      const { data } = await api(`/users/stats/${id}`, {
        admin: true,
        authenticated: true,
        method: "GET",
      });

      return data.userStat as Stats;
    },
    enabled: id !== undefined,
  });
}
