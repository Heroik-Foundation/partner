import { cn } from "@/lib/utils";
import { Sidebar } from "../navigation/sidebar";

import { useSidebarStore } from "@/stores/sidebar";
import { useMediaQuery } from "@/hooks/media-query";

type Children = {
  children: React.ReactNode;
};

export const ViewProvider = ({ children }: Children) => {
  const { isOpen } = useSidebarStore();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const sidebarVisible = isDesktop || isOpen;

  return (
    <main className="h-screen relative">
      <Sidebar />

      <div className={cn("p-5", sidebarVisible && "lg:ml-64 2xl:ml-72")}>
        {children}
      </div>
    </main>
  );
};

export const AuthViewProvider = ({ children }: Children) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Desktop layout: split 50/50
  if (isDesktop) {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Left side - Image */}
        <div className="w-1/2 h-full relative">
          <img
            src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzfGVufDB8fDB8fHww"
            alt="Auth background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Children */}
        <div className="w-1/2 h-full overflow-y-auto p-5">{children}</div>
      </div>
    );
  }

  // Mobile layout: full screen with background image behind children
  return <main className="p-5">{children}</main>;
};
