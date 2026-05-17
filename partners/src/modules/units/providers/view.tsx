import { cn } from "@/lib/utils";
import { Sidebar } from "../navigation/sidebar";

import { useSidebarStore } from "@/stores/sidebar";
import { useMediaQuery } from "@/hooks/media-query";
import authAsideImg from "@/assets/images/auth.jpeg";

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
        <div className="w-1/2 h-full overflow-y-auto p-5 no-scrollbar overflow-y-auto">
          {children}
        </div>

        {/* Right side - Children */}
        <div className="w-1/2 h-full relative p-5">
          <img
            src={authAsideImg}
            alt="Auth background"
            className="w-full h-full object-cover object-left rounded-3xl"
          />
        </div>
      </div>
    );
  }

  // Mobile layout: full screen with background image behind children
  return <main className="p-5">{children}</main>;
};
