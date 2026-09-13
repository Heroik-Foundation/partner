import { getSessionToken, deleteSessionToken } from "@/helpers/session";
import { Fragment } from "react/jsx-runtime";
import { Token, decodedJWT } from "@/helpers/jwt";
import { useEffect } from "react";
import { useRouterState, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const sessionToken = getSessionToken();
  const pathname = useRouterState().location.pathname;
  const navigate = useNavigate();
  const validToken: Token = decodedJWT(sessionToken);
  const currentTimeStamp = Math.floor(Date.now() / 1000);

  useEffect(() => {
    if (sessionToken) {
      if (currentTimeStamp > validToken.exp) {
        deleteSessionToken();
        navigate({
          to: "/",
        });
        toast.error("Your session has expired. Please Login", {
          id: "session",
        });
      }
    } else if (!sessionToken) {
      navigate({
        to: "/",
      });
      toast.error("Please Login and Try Again", {
        id: "session",
      });
    }
    window.scroll(0, 0);
  }, [sessionToken, pathname]);

  return <Fragment>{children}</Fragment>;
}
