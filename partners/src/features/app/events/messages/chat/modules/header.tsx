import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu";
import { PreviousButton } from "@/modules/units/page/button";

import { MoreVertical } from "lucide-react";

export const ChatHeader = () => {
  return (
    <header className="shadow-sm fixed w-full top-0 left-0 right-0 py-5 px-2 flex items-center justify-between">
      <div className="flex items-center space-x-2.5">
        <PreviousButton />

        <div className="flex items-center space-x-2.5">
          <div className="min-w-10 min-h-10 rounded-full border/20 border-primary">
            <img src="" className="h-full w-full" alt="" />
          </div>

          <h5 className="text-sm font-black text-primary">Ethan Silva</h5>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical className="stroke-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="space-y-2.5 rounded-xl">
          <DropdownMenuItem>View Member Profile</DropdownMenuItem>
          <DropdownMenuItem>Report Member</DropdownMenuItem>
          <DropdownMenuItem>Block Member</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
