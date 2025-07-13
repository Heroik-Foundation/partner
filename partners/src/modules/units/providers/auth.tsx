import { getTokens } from "@/lib/session";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { Fragment, ReactNode, useCallback, useEffect } from "react";
import { toast } from "sonner";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { navigate } = useRouter();
  const { location } = useRouterState();
  const { sessionToken } = getTokens();
  const pathname = location.pathname;

  const handleAuthState = useCallback(() => {
    if (!sessionToken) {
      toast.error("Please login to access the dashboard", {
        id: "authentication-error",
      });
      navigate({
        to: "/auth/login",
      });
    }
  }, [sessionToken]);

  useEffect(() => {
    handleAuthState();

    return () => {
      handleAuthState();
    };
  }, [sessionToken, pathname]);

  return <Fragment>{children}</Fragment>;
};
