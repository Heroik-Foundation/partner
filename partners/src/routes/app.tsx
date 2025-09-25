import { AuthProvider } from "@/modules/units/providers/auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/react";

export const Route = createFileRoute("/app")({
  component: () => (
    <NuqsAdapter>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </NuqsAdapter>
  ),
});
