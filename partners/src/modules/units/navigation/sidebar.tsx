import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  HomeIcon,
  BadgeDollarSignIcon,
  MessageCircleReplyIcon,
  UsersRoundIcon,
  Calendar1Icon,
} from "lucide-react";

import { useMediaQuery } from "@/hooks/media-query";
import { TeamSwitcher } from "./team-switcher";

const links = [
  {
    icon: HomeIcon,
    label: "Home",
    path: "/app",
  },
  {
    icon: Calendar1Icon,
    label: "Events",
    path: "/app/events",
  },
  {
    icon: UsersRoundIcon,
    label: "Channels",
    path: "/app/channels",
  },
  {
    icon: MessageCircleReplyIcon,
    label: "Messages",
    path: "/app/messages",
  },
  {
    icon: BadgeDollarSignIcon,
    label: "Revenue",
    path: "/app/revenue",
  },
];

export const Sidebar = () => {
  const routerState = useRouterState();
  const { pathname } = routerState.location;

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (isDesktop) {
    return (
      <aside className="lg:w-64 2xl:w-72 border-r fixed left-0 top-0 bottom-0 h-screen bg-white z-50 py-10 space-y-10">
        <div className="flex w-full h-full relative flex-col space-y-10">
          {/* logo and nav content – same as original */}
          <div className="flex items-center space-x-2 px-10">
            <div className="bg-primary rounded-lg h-8 w-8 flex items-center justify-center">
              <img src="/logo/logo-white.svg" className="w-4 h-4" />
            </div>
            <span className="text-2xl font-bold text-primary">Hiroek</span>
          </div>

          <nav className="flex items-start flex-col space-y-5 px-8">
            {links.map(({ icon, label, path }, index) => {
              const Icon = icon;
              const isActive = pathname === path;
              return (
                <Link
                  className="flex items-center space-x-2.5 px-2 py-3 hover:bg-primary/5 w-full rounded-xl"
                  to={path}
                  key={index}
                >
                  <Icon
                    className={cn(isActive && "stroke-primary fill-primary/10")}
                  />
                  <span
                    className={cn(isActive && "text-primary", "font-semibold")}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="px-8 absolute bottom-0">
            <TeamSwitcher />
          </div>
        </div>
      </aside>
    );
  }
};
