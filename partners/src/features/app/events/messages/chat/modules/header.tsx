import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu";
import { PreviousButton } from "@/modules/units/page/button";
import { MoreVertical, UserCircle2Icon } from "lucide-react";

type Props = {
  user: {
    fullname?: string;
    photo?: string;
  };
};

export const ChatHeader = (props: Props) => {
  const { user } = props;

  return (
    <header className="shadow-sm fixed w-full top-0 left-0 right-0 py-5 px-2 flex items-center justify-between lg:ml-64 2xl:ml-72 bg-white z-10">
      <div className="flex items-center space-x-2.5">
        <PreviousButton />

        <div className="flex items-center space-x-2.5">
          <div
            className={cn(
              "w-10 h-10 rounded-full border/20 border-primary flex items-center justify-center",
              !user?.photo && "bg-primary/10",
            )}
          >
            {user.photo ? (
              <img
                src={user.photo}
                className="h-full w-full rounded-full object-cover object-center"
                alt=""
                loading="eager"
              />
            ) : (
              <UserCircle2Icon className="stroke-primary" />
            )}
          </div>

          <h5 className="text-sm font-black text-primary">
            {user.fullname || "User"}
          </h5>
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
