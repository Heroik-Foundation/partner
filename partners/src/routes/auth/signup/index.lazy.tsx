import SignUp from "@/features/auth/signup";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/auth/signup/")({
  component: SignUp,
});
