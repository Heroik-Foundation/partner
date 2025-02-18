import { CharityOrganization } from "@/components/table/columns/charities";
import { api } from "@/lib/axios";
import {
  QueryClient,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface Stats {
  walletBalance: number;
  eventDonationsCount: number;
  eventsCreated: number;
  eventParticipation: number;
  directDonations: number;
  eventDonations: number;
  totalDonations: number;
  totalDonors: number;
}

export function useAllOrganizations({
  filter,
}: {
  filter?: "claimed" | "with-donations";
}) {
  const queryClient = new QueryClient();
  return useInfiniteQuery({
    queryKey: ["organizations-list", filter],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(
        `/organizations?page=${pageParam}&sort=${filter}`,
        {
          admin: false,
          authenticated: true,
          method: "GET",
        }
      );

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
      const queryCacheData = queryClient.getQueryState([
        "organizations-list",
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

export function useOrganizationDetails({ id }: { id: string }) {
  return useQuery({
    queryKey: ["organization"],
    queryFn: async () => {
      const { data } = await api(`/organizations/${id}`, {
        admin: false,
        authenticated: true,
        method: "GET",
      });

      return data.organization as CharityOrganization;
    },
  });
}

export function useOrganizationEvents({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["organization-events", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(
        `/organizations/organization-events/${id}?page=${pageParam}`,
        {
          method: "GET",
          admin: false,
          authenticated: true,
        }
      );

      return data;
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
        "organization-events",
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

export function useOrganizationWithdrawalLogs({ id }: { id: string }) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["organization-logs", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(
        `/organizations/withdrawal-logs/${id}?page=${pageParam}`,
        {
          method: "GET",
          admin: false,
          authenticated: true,
        }
      );

      return data.logs;
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
        "organization-logs",
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

export function useOrganizationDonations({
  type,
  id,
}: {
  type: "direct" | "indirect";
  id: string | undefined;
}) {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["organization-donations-list"],
    queryFn: async ({ pageParam = 1 }) => {
      if (type === "direct") {
        const { data } = await api(
          `/organizations/direct-donation-history/${id}?page=${pageParam}`,
          {
            method: "GET",
            admin: false,
            authenticated: true,
          }
        );

        return data.donations;
      } else {
        const { data } = await api(
          `/organizations/indirect-donation-history/${id}?page=${pageParam}`,
          {
            method: "GET",
            admin: false,
            authenticated: true,
          }
        );

        return data.donations;
      }
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
        "organization-donations-list",
      ])?.data;
      if (queryCacheData) {
        return {
          pageParams: [undefined, 1],
          pages: [queryCacheData],
        };
      }
    },
    initialPageParam: 1,
    enabled: id !== undefined,
  });
}

export function useInterests() {
  const queryClient = useQueryClient();
  return useInfiniteQuery({
    queryKey: ["interests-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api(`/interests?page=${pageParam}`, {
        method: "GET",
        admin: true,
        authenticated: true,
      });

      return data.interests;
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
        "interests-list",
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

export function useOrganizationStats({ id }: { id: string | undefined }) {
  return useQuery({
    queryKey: ["organization-stats"],
    queryFn: async () => {
      const { data } = await api(`/organizations/stats/${id}`, {
        admin: false,
        authenticated: true,
        method: "GET",
      });

      return data.stats as Stats;
    },
    enabled: id !== undefined,
  });
}
