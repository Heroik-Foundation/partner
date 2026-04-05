"use client";

import * as React from "react";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu";

import {
  getActiveSession,
  setActiveSession,
  clearAllSessions,
  getAllSessions,
} from "@/lib/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/modules/ui/avatar";
import { truncateText } from "@/helpers/text";

export function TeamSwitcher() {
  const { navigate } = useRouter();
  const [activeTeam, setActiveTeam] = React.useState(() => {
    const active = getActiveSession();
    return active || null;
  });

  const sessions = getAllSessions();

  // Update active team when sessions change
  React.useEffect(() => {
    const active = getActiveSession();
    if (active) {
      setActiveTeam(active);
    }
  }, [sessions.length]);

  const handleSwitchAccount = (sessionEmail: string) => {
    const success = setActiveSession(sessionEmail);
    if (success) {
      toast.success("Switched account");
      navigate({ to: "/app" });
      window.location.reload(); // Force reload to update all components
    }
  };

  const handleLogout = () => {
    clearAllSessions();
    toast.success("Logged out of all accounts");
    navigate({ to: "/auth/login" });
  };

  const handleGoToProfile = () => {
    navigate({ to: "/app/profile" });
  };

  if (!activeTeam) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex space-x-2 items-center border rounded-xl p-2">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={
                activeTeam.photoUrl ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${activeTeam.name}`
              }
            />
            <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              {activeTeam.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-primary">
              {truncateText(activeTeam.name || "User", 20)}
            </span>
            <span className="truncate text-xs font-medium text-primary/50">
              {truncateText(activeTeam.email, 25)}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg p-2"
        align="start"
        side={"bottom"}
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground text-center">
          Switch Account
        </DropdownMenuLabel>
        {sessions
          .filter((session) => session.email !== activeTeam?.email)
          .map((session) => (
            <DropdownMenuItem
              key={session.email}
              onClick={() => handleSwitchAccount(session.email)}
              className="gap-2 p-2"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={
                    session.photoUrl ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${session.name}`
                  }
                />
                <AvatarFallback>{session.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1">
                <span className="text-sm">
                  {truncateText(session.name || "User", 20)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {truncateText(session.email, 25)}
                </span>
              </div>
            </DropdownMenuItem>
          ))}

        {sessions.length === 1 && (
          <div className="py-2 text-center text-xs text-muted-foreground bg-primary/15 text-primary rounded-lg font-semibold">
            No other accounts
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleGoToProfile} className="gap-2 p-2">
          <User className="size-3" />
          <span className="text-xs">Profile Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="gap-2 p-2 text-rose-600 focus:text-rose-600"
        >
          <LogOut className="size-3" />
          <span className="text-xs">Log out of all accounts</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
