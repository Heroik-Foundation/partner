import { cn } from "@/lib/utils";
import { useRouterState } from "@tanstack/react-router";

type Children = {
  children: React.ReactNode;
};

export const ViewProvider = ({ children }: Children) => {
  const pathname = useRouterState().location.pathname;
  return (
    <main
      className={cn("max-w-lg p-4 relative mx-auto", pathname === "/" && "p-0")}
    >
      {children}
    </main>
  );
};
