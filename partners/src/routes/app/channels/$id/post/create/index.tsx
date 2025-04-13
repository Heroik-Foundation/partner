import CreatePost from "@/features/app/channels/create/post";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/app/channels/$id/post/create/")({
  component: CreatePost,
  validateSearch: z.object({
    broadcast: z.boolean().optional(),
  }),
});
