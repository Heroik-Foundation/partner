import { cn } from "@/lib/utils";
import { buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";
import { MessageSquarePlus } from "lucide-react";

type CreatePostLinkProps = {
  id: string;
};

export const CreatePostLink = ({ id }: CreatePostLinkProps) => {
  return (
    <div className="fixed bottom-10 left-[70%] sm:left-1/2 -translate-x-1/2">
      <div className="flex">
        <Link
          className={cn(
            buttonVariants({
              variant: "default",
              size: "lg",
            }),
            "px-6 shadow-lg hover:shadow-xl transition-shadow"
          )}
          to="/app/channels/$id/post/create"
          params={{
            id,
          }}
        >
          <MessageSquarePlus /> <span> Create Post</span>
        </Link>
      </div>
    </div>
  );
};
