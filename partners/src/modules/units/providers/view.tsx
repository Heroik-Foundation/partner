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
        // Base styles for all devices
        "relative mx-auto",

        // Mobile (default): full width with small padding
        "w-full p-4",

        // Tablet: slightly larger max-width with adjusted padding
        "md:max-w-2xl md:p-6",

        // Desktop: larger max-width
        "lg:max-w-4xl",

        // XL screens: even larger max-width
        "xl:max-w-6xl",

        // Special case for home page
        pathname === "/" && "p-0 md:p-0 lg:p-0"
      )}
    >
      {children}
    </main>
  );
};
