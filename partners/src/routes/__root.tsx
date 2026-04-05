import { Outlet, createRootRoute } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";
import { QueryProvider } from "@/modules/units/providers/tanstack";
import { Toaster } from "sonner";
import { RouterTracker } from "@/modules/units/providers/router";
import { ErrorComponent } from "@/features/app/error";

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <Toaster richColors position="top-center" />
        <Outlet />
        <RouterTracker />
      </QueryProvider>
    </NuqsAdapter>
  );
}
