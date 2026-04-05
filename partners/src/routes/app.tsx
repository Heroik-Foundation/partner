import { AuthProvider } from "@/modules/units/providers/auth";
import { ViewProvider } from "@/modules/units/providers/view";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => (
    <AuthProvider>
      <ViewProvider>
        <Outlet />
      </ViewProvider>
    </AuthProvider>
  ),
});
