import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { CurrencyCode } from "@/stores/currency";

import { useInfiniteQuery } from "@tanstack/react-query";

export type EventSaleType = {
  _id: string;
  event: {
    _id: string;
    photo: string;
    name: string;
    description: string;
    fundRaiser: {
      fundRaised: number;
      goalReached: boolean;
      fundRaisingGoal: number;
      organizations: string[];
    };
    ticketing: {
      ticketType: string;
      ticketPrice: number;
      signUpLimit: number;
      salesStartDate: string; // ISO date string
      salesEndDate: string; // ISO date string
    }[];
    eventPledge: {
      minimumPledge: number;
      totalPledgedAmount: number;
      organizations: string[];
    };
    recurrence: {
      interval: number;
      frequency: string;
      daysOfWeek: number[];
      endType: string;
      occurrenceCount: number;
    };
    organization: string;
    category: {
      _id: string;
      image: string;
      name: string;
      subcategories: {
        _id: string;
        image: string;
        name: string;
      }[];
    };
    subcategory: {
      _id: string;
      image: string;
      name: string;
    };
    signUpLimit: string;
    spotsLeft: string;
    eventEndDate: string;
    privacy: string;
    endTime: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    currency: CurrencyCode;
    members: string[];
    community: {
      _id: string;
      members: string[];
      invitees: string[];
      moderators: string[];
      name: string;
      description: string;
      privacy: string;
      admin: {
        _id: string;
        fullname: string;
        username: string;
        phone: string;
        photo: string;
        birthDate: string;
        callingCode: string;
        isAdmin: boolean;
        blocked: boolean;
        isAccountSetup: boolean;
        role: string;
        loc: {
          type: "Point";
          coordinates: [number, number];
        };
        email: string;
        blockedUsers: string[];
        followers: string[];
        following: string[];
      };
      adminType: string;
      posts: {
        totalPosts: number;
      }[];
      totalMembers: number;
      totalPosts: number;
    };
    absorbFees: boolean;
    admin: string;
    adminType: string;
  };
  user: {
    _id: string;
    fullname: string;
    username: string;
    phone: string;
    photo: string;
    birthDate: string;
    callingCode: string;
    isAdmin: boolean;
    blocked: boolean;
    isAccountSetup: boolean;
    role: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    email: string;
    blockedUsers: string[];
    followers: string[];
    following: string[];
  };
  totalTickets: number;
  ticketType: {
    ticketType: string;
    ticketPrice: number;
    signUpLimit: number;
    salesStartDate: string;
    salesEndDate: string;
  };
  tickets: {
    code: string;
    isGifted: boolean;
    giftedBy: string;
    giftedAt: string;
  }[];
  createdAt: string;
};

export function useTicketSalesListQuery() {
  return useInfiniteQuery({
    queryKey: ["ticket-sales-list"],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get(
        "/events/admin-ticket-sales",
        {
          params: {
            page: pageParam,
          },
        }
      );

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.flatMap((page) => page.result.data),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.result;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}

export function useWithdrawalLogsListQuery() {
  const { data } = useUserPropertiesQuery();
  const userId = data?._id;

  return useInfiniteQuery({
    queryKey: ["withdrawal-logs-list", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get(
        `/event-partners/withdrawal-logs/${userId}`,
        {
          params: {
            page: pageParam,
          },
        }
      );

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.flatMap((page) => page.logs.data),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.logs;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(5),
  });
}
