import { useMediaQuery } from "@/hooks/media-query";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { UserCircle2 } from "lucide-react";

type HighlightProps = {
  thumbnail: string;
  title: string;

  members: number;
  avatars: string[];
  id: string;
};

export const Highlight = (props: HighlightProps) => {
  const { thumbnail, title, avatars, members, id } = props;
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="space-y-5">
      <Link
        to="/app/channels/$id/members"
        params={{
          id: id,
        }}
        className="w-full flex items-center justify-center"
      >
        <div className="bg-white text-primary shadow p-2 rounded-full inline-flex space-x-2 items-center">
          <div className="flex -space-x-2">
            {avatars.slice(0, 3).map((avatar, index) => {
              if (avatar) {
                return (
                  <img
                    key={index}
                    src={avatar}
                    alt="Avatar"
                    loading="eager"
                    className="size-5 sm:size-6 rounded-full object-fill border-2 border-white"
                  />
                );
              }

              return (
                <UserCircle2
                  className="size-5 sm:size-6 fill-primary/20 stroke-primary"
                  strokeWidth={1.5}
                />
              );
            })}
          </div>

          <span className="text-xs sm:text-sm font-bold">
            {members} Members
          </span>
        </div>
      </Link>

      <img
        src={thumbnail}
        className={cn(
          "h-[400px] w-full items-center object-cover rounded-2xl",
          !isDesktop && "h-[200px]",
        )}
        loading="eager"
        alt={`${title} thumbnail`}
      />
    </div>
  );
};
