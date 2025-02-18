import Contact from "@/features/app/settings/contact";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/app/settings/contact/")({
  component: Contact,
});
