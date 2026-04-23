import { Link } from "@tanstack/react-router";
import { LayoutGrid, BanknoteArrowUpIcon } from "lucide-react";

import { useMediaQuery } from "@/hooks/media-query";

export const Sidebar = () => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <aside className="lg:w-64 2xl:w-72 border-r fixed left-0 top-0 bottom-0 h-screen bg-white z-50 py-5">
        <div className="flex w-full h-full relative flex-col space-y-5">
          {/* logo and nav content – same as original */}
          <div className="flex flex-col items-start px-8 border-b pb-5">
            <h1 className="text-lg font-extrabold text-primary">Hiroek</h1>
            <span className="text-black/40 text-sm font-semibold">
              Creator Platform
            </span>
          </div>

          <div className="flex flex-col px-5 space-y-3">
            <Link
              to="/app/dashboard"
              className="h-12 rounded-xl bg-accent w-full p-2 flex items-center justify-center space-x-1.5 text-xs font-extrabold text-white"
            >
              <LayoutGrid strokeWidth={1.7} size={18} />
              <span>View Creator Dashboard</span>
            </Link>

            <Link
              to="/app/revenue"
              className="h-12 rounded-xl bg-primary w-full p-2 flex items-center justify-center space-x-1.5 text-xs font-extrabold text-white"
            >
              <BanknoteArrowUpIcon strokeWidth={1.7} size={18} />
              <span>Manage Event Revenue</span>
            </Link>
          </div>
        </div>
      </aside>
    );
  }
};
