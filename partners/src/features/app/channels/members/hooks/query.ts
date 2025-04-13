import { Member, NestedPaginatedResponse } from "@/features/app/global/types";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useChannelModeratorsListQuery({ id }: { id: string }) {
  return useInfiniteQuery({
    queryKey: ["channel-moderators-list", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get(
        `/communities/get-moderators/${id}`,
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
      pages: pages[0].flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useChannelMembersListQuery({ id }: { id: string }) {
  return useInfiniteQuery({
    queryKey: ["channel-memebers-list", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Member, "members">
      >(`/communities/${id}/members`, {
        params: {
          page: pageParam,
        },
      });

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages[0].members.data.flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.members;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
