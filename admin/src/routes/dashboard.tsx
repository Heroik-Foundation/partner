import { AuthProvider } from "@/components/auth/provider";
import { Sidebar } from "@/components/navigation/sidebar";
import { Sidenav } from "@/components/navigation/sidenav";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AuthProvider>
      <div className="h-[100vh] w-full lg:bg-gradient-to-r from-pink-50/90 to-blue-200 font-inter relative">
        <Sidebar />
        <Sidenav />
        <main className="lg:fixed min-h-[100vh] lg:min-h-[auto] overflow-y-scroll right-0 w-full lg:w-[calc(100%-250px)] top-0 bottom-0 bg-[#F3F6F8] lg:rounded-tl-[60px] px-7 pt-10 pb-7 shadow-sm">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  ),
});
