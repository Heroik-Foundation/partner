import { AuthProvider } from "@/modules/units/providers/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  ),
});
