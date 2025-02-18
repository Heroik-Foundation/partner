import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type {
  NestedPaginatedResponse,
  Post,
} from "@/features/app/global/types";

type QueryProps = {
  id?: string;
};

type ChannelPostsQueryResponse = {
  posts: Post[];
};

//Posts

export function useChannelPostsQuery(props: QueryProps) {
  const { id } = props;
  return useInfiniteQuery({
    queryKey: ["channel-posts", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Post, "posts">
      >(`/posts/community/${id}`, {
        params: {
          page: pageParam,
        },
      });

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages[0].posts.data.flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.posts;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}

//Announcements

export function useChannelAnnouncementsQuery(props: QueryProps) {
  const { id } = props;
  return useQuery({
    queryKey: ["channel-posts"],
    queryFn: async () => {
      const { data } =
        await authenticatedInstance.get<ChannelPostsQueryResponse>(
          `/posts/community/${id}`
        );

      return data;
    },
  });
}
