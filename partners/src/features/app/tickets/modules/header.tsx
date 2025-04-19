"use client";

import { Button } from "@/modules/ui/button";
import { Lock, RefreshCcw } from "lucide-react";
import { FlashOffIcon, HistoryIcon } from "./icons";
import { Link, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Header() {
  const { history } = useRouter();

  return (
    <header className="w-full flex flex-col space-y-10">
      <div className="flex items-center justify-between text-white">
        <button onClick={() => history.back()} className="text-sm font-medium">
          Back
        </button>
        <div className="flex items-center space-x-1">
          <Lock size="16" />
          <span className="text-xs font-semibold">
            partners.hiroek.io/ticket/scan
          </span>
        </div>
        <div>
          <RefreshCcw size="16" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-0.5">
          <FlashOffIcon />
          <Button
            size="sm"
            className="bg-white text-primary rounded-full disabled:bg-white/40 text-xs font-bold"
            disabled
          >
            Flash On
          </Button>
        </div>

        <Link
          to="/app/tickets/history"
          className={cn(
            "inline-flex items-center justify-center px-4 min-w-20 h-10 gap-2 bg-white text-primary rounded-full text-sm font-bold"
          )}
        >
          <HistoryIcon />
          <span>Ticket Scan History</span>
        </Link>
      </div>
    </header>
  );
}
