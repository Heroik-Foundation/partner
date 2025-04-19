"use client";

import { Lock, RefreshCcw } from "lucide-react";

import { useParams, useRouter } from "@tanstack/react-router";
import { truncateText } from "@/helpers/text";

export function Header() {
  const { history } = useRouter();
  const { id } = useParams({
    strict: false,
  });

  return (
    <header className="flex items-center justify-between text-white">
      <button onClick={() => history.back()} className="text-sm font-medium">
        Close
      </button>
      <div className="flex items-center space-x-1">
        <Lock size="16" />
        <span className="text-xs font-semibold">
          {truncateText(`partners.hiroek.io/shared-event/${id}`, 16)}
        </span>
      </div>
      <div>
        <RefreshCcw size="16" />
      </div>
    </header>
  );
}
