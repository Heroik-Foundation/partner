import PostDetails from "@/features/app/channels/detail/post";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/$id/post/$postId/")({
  component: PostDetails,
});
