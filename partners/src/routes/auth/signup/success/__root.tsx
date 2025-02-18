import { QueryProvider } from "@/modules/logic/providers/tanstack";
import { ViewProvider } from "@/modules/ui/units/providers/view";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: () => (
    <QueryProvider>
      <ViewProvider>
        <Toaster richColors position="top-center" />
        <Outlet />
      </ViewProvider>
    </QueryProvider>
  ),
});
