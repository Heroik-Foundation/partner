import { create } from "zustand";

type RouteStore = {
  currentPath: string | null;
  previousPath: string | null;
  setPath: (path: string) => void;
};

export const useRouteStore = create<RouteStore>((set, get) => ({
  currentPath: null,
  previousPath: null,
  setPath: (newPath) => {
    const { currentPath } = get();
    if (currentPath !== newPath) {
      set({
        previousPath: currentPath,
        currentPath: newPath,
      });
    }
  },
}));
