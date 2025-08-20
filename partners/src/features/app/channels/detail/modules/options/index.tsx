import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/ui/dialog";

import channelAccessIcon from "./assets/channel-access.svg";
import channelDescriptionIcon from "./assets/channel-description.svg";
import channelEditIcon from "./assets/channel-edit.svg";
import channelShareIcon from "./assets/channel-share.svg";
import channelDeleteIcon from "./assets/channel-delete.svg";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShareDialog } from "@/modules/units/page/share";

interface Props {
  id: string;
  title: string;
  description: string;
}

const options = [
  {
    title: "Channel Access (Private)",
    variant: "primary",
    icon: channelAccessIcon,
  },
  {
    title: "Channel Description",
    variant: "default",
    icon: channelDescriptionIcon,
    dialog: true, // ✅ mark this one as dialog-enabled
  },
  {
    title: "Edit Channel",
    variant: "default",
    icon: channelEditIcon,
    link: {
      path: "/app/channels/$id/edit",
    },
  },
  {
    title: "Share Channel",
    variant: "default",
    icon: channelShareIcon,
    share: true,
  },
  {
    title: "Delete Channel",
    variant: "destructive",
    icon: channelDeleteIcon,
  },
];

export function ChannelOptions({ id, description }: Props) {
  return (
    <div className="relative z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center justify-center bg-primary/10 w-11 h-11 rounded-full">
            <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center text-white">
              <MoreVertical size={20} />
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {options.map(
            ({ icon, title, variant, dialog, link, share }, index) => {
              const item = (
                <DropdownMenuItem
                  key={index}
                  onSelect={(e) => e.preventDefault()}
                  className={cn(
                    "w-[260px] h-[48px] text-primary flex gap-2",
                    variant === "primary" &&
                      "bg-primary text-white hover:bg-primary/90 hover:text-white rounded-t"
                  )}
                >
                  <img src={icon} className="w-4 h-4" alt="" />
                  <span className="text-sm font-bold">{title}</span>
                </DropdownMenuItem>
              );

              // ✅ wrap in dialog if required
              return dialog ? (
                <DescriptionDialog
                  description={description}
                  key={index}
                  trigger={item}
                />
              ) : link ? (
                <Link
                  to={link.path}
                  params={{
                    id,
                  }}
                >
                  {item}
                </Link>
              ) : share ? (
                <ShareDialog
                  dialogTitle="Share this channel"
                  title={title}
                  description={description}
                  url={`https://partners.hiroek.io/channel/${id}`}
                  trigger={item}
                />
              ) : (
                item
              );
            }
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DescriptionDialog({
  trigger,
  description,
}: {
  trigger: ReactNode;
  description: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-sm font-bold text-primary">
            Channel Description
          </DialogTitle>
          <DialogDescription className="text-primary text-sm font-semibold">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
