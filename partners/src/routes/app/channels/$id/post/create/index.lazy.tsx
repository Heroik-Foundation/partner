import CreatePost from "@/features/app/channels/create/post";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/channels/$id/post/create/")({
  component: CreatePost,
});
