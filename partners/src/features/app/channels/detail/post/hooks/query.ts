import {
  Comment,
  NestedPaginatedResponse,
  Post,
} from "@/features/app/global/types";
import { authenticatedInstance } from "@/lib/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

type DetailsQuery = {
  id?: string;
};

type PostDetailsQueryResponse = {
  post: Post;
};

export function usePostDetailsQuery(props: DetailsQuery) {
  const { id } = props;
  return useQuery({
    queryKey: ["post-details", id],
    queryFn: async () => {
      const { data } =
        await authenticatedInstance.get<PostDetailsQueryResponse>(
          `/posts/${id}`
        );

      return data.post;
    },
  });
}

export function usePostCommentsQuery(props: DetailsQuery) {
  const { id } = props;
  return useInfiniteQuery({
    queryKey: ["post-comments", id],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await authenticatedInstance.get<
        NestedPaginatedResponse<Comment, "comments">
      >(`/posts/${id}/comments`, {
        params: {
          page: pageParam,
        },
      });

      return data;
    },
    initialPageParam: 1,
    select: ({ pageParams, pages }) => ({
      pageParams,
      pages: pages.map((page) => page.comments.data).flat(),
    }),
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.comments;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
}
