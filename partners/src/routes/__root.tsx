import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ViewProvider } from "@/modules/units/providers/view";
import { QueryProvider } from "@/modules/units/providers/tanstack";
import { Toaster } from "sonner";
import { RouterTracker } from "@/modules/units/providers/router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryProvider>
      <ViewProvider>
        <Toaster richColors position="top-center" />
        <Outlet />
        <RouterTracker />
      </ViewProvider>
    </QueryProvider>
  );
}
