import { AuthViewProvider } from "@/modules/units/providers/view";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: () => (
    <AuthViewProvider>
      <Outlet />
    </AuthViewProvider>
  ),
});
