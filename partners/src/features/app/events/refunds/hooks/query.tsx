import { CurrentUser } from "@/features/app/global/types";
import { timeInMinutes } from "@/helpers/time";
import { authenticatedInstance } from "@/lib/axios";
import { CurrencyCode } from "@/stores/currency";
import { useInfiniteQuery } from "@tanstack/react-query";

export interface EventRefund {
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
    ticketing: Array<{
      ticketType: string;
      ticketDetails: string;
      ticketPrice: number;
      signUpLimit: number;
      salesStartDate: string;
      salesEndDate: string;
    }>;
    eventPledge: {
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
      subcategories: Array<{
        _id: string;
        image: string;
        name: string;
      }>;
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
    currency: string;
    eventStatus: string;
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
      posts: Array<{
        totalPosts: number;
      }>;
      totalMembers: number;
      totalPosts: number;
    };
    promoCode: {
      code: string;
      discount: number;
    };
    absorbFees: boolean;
    isRefundable: boolean;
    refundDisabled: boolean;
    admin: string;
    adminType: string;
  };
  status: string;
  user: CurrentUser;
  paymentIntentId: string;
  amount: number;
  currency: CurrencyCode;
}

export type EventVoucher = {
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
    ticketing: Array<{
      ticketType: string;
      ticketDetails: string;
      ticketPrice: number;
      signUpLimit: number;
      salesStartDate: string;
      salesEndDate: string;
    }>;
    eventPledge: {
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
      subcategories: Array<{
        _id: string;
        image: string;
        name: string;
      }>;
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
    currency: string;
    eventStatus: string;
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
      posts: Array<{
        totalPosts: number;
      }>;
      totalMembers: number;
      totalPosts: number;
    };
    promoCode: {
      code: string;
      discount: number;
    };
    absorbFees: boolean;
    isRefundable: boolean;
    refundDisabled: boolean;
    admin: string;
    adminType: string;
  };
  eventAuthorID: string;
  user: CurrentUser;
  code: string;
  amount: number;
  amountLeft: number;
  expiryDate: string;
};

export function useEventRefundsListQuery({ eventId }: { eventId: string }) {
  return useInfiniteQuery({
    queryKey: ["event-refunds-list", eventId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get(
        `/events/payment-refunds/${eventId}`,
        { params: { page: pageParam } },
      );
      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.flatMap((page) => page.data), // ✅ was page.result.data
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage; // ✅ was lastPage.result
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(30),
  });
}

export function useEventVouchersListQuery({ eventId }: { eventId: string }) {
  return useInfiniteQuery({
    queryKey: ["event-vouchers-list", eventId], // ✅ also fixed duplicate key (was "ticket-sales-list" on both)
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get(
        `/events/voucher-refunds/${eventId}`,
        { params: { page: pageParam } },
      );
      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.flatMap((page) => page.data), // ✅ was page.result.data
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage; // ✅ was lastPage.result
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: timeInMinutes(30),
  });
}
