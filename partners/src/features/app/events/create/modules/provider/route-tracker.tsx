import { useRouteStore } from "@/hooks/router";
import { ReactNode, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";

export const RouteTrackerProvider = ({ children }: { children: ReactNode }) => {
  const pathname = useRouterState().location.pathname;
  const { setPath } = useRouteStore();

  const handlePathTrankingRouteUpdate = () => {
    setPath(pathname);
  };

  useEffect(() => {
    handlePathTrankingRouteUpdate();
  }, [pathname]);

  return <Fragment>{children}</Fragment>;
};
