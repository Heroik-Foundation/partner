import { cn } from "@/lib/utils";
import { useRouterState } from "@tanstack/react-router";

type Children = {
  children: React.ReactNode;
};

export const ViewProvider = ({ children }: Children) => {
  const pathname = useRouterState().location.pathname;
  return (
    <main
      className={cn(
        "relative mx-auto",

        "w-full p-4",

        "md:max-w-2xl md:p-6",

        "lg:max-w-4xl",

        pathname === "/" && "p-0 md:p-0 lg:p-0"
      )}
    >
      {children}
    </main>
  );
};
