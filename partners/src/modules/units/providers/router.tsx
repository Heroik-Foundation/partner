import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useRouteStore } from "@/hooks/router";

export function RouterTracker() {
  const router = useRouterState();
  const setPath = useRouteStore((state) => state.setPath);

  useEffect(() => {
    setPath(router.location.pathname);
  }, [router.location.pathname]);

  return null;
}
