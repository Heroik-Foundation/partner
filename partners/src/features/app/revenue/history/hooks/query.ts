import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export type EventSaleType = {
  _id: string;
  createAt: string;
  event: {
    _id: string;
    fundRaiser: {
      organizations: string[];
      fundRaised: number;
      goalReached: boolean;
    };
    eventPledge: {
      organizations: string[];
      totalPledgedAmount: number;
      minimumPledge: number;
    };
    adminType: string;
    isTicketed: boolean;
    isRecurring: boolean;
    isPrimaryEvent: boolean;
    primaryEventId: string | null;
    members: string[];
    privacy: string;
    invitees: string[];
    isStarted: boolean;
    isClosed: boolean;
    absorbFees: boolean;
    name: string;
    address: string;
    category: string;
    description: string;
    subcategory: string;
    endTime: string;
    eventEndDate: string;
    recurrence: {
      interval: number;
      daysOfWeek: number[];
      endType: string;
      totalOccurrences: number;
      _id: string;
      frequency: string;
      occurrenceCount: number;
    };
    ticketing: Array<{
      isPayedTicket: boolean;
      signUpLimit: number;
      _id: string;
      ticketType: string;
      ticketPrice: number;
      salesStartDate: string;
      salesEndDate: string;
      spotsLeft: number;
      totalTicket: number;
    }>;
    photo: string;
    admin: string;
    eventUuid: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  user: {
    _id: string;
    isActive: boolean;
    isAdmin: boolean;
    blocked: boolean;
    isDeleted: boolean;
    isAccountSetup: boolean;
    role: string;
    fullname: string;
    interest: string[];
    blockedUsers: string[];
    following: string[];
    followers: string[];
    importedContacts: string[];
    fcm_tokens: string;
    phone: string;
    callingCode: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    email: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  totalTickets: number;
  ticketType: {
    isPayedTicket: boolean;
    signUpLimit: number;
    _id: string;
    ticketType: string;
    ticketPrice: number;
    salesStartDate: string;
    salesEndDate: string;
    spotsLeft: number;
    totalTicket: number;
  };
  tickets: Array<{
    isGifted: boolean;
    giftedBy: string | null;
    giftedAt: string | null;
    _id: string;
    code: string;
  }>;
  createdAt: string;
  updatedAt: string;
  __v: number;
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
