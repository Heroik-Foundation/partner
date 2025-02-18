import { cn } from "@/lib/utils";
import { buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type ContentType = {
  type: "event" | "channel";
  children?: React.ReactNode;
};

function ContentHeader({ type }: ContentType) {
  return (
    <div className="w-full flex items-center justify-between">
      <h5 className="first-letter:uppercase font-black text-primary">
        {type}s
      </h5>
      <Link
        className={cn(
          buttonVariants({
            variant: "default",
            size: "sm",
            className: "text-xs",
          })
        )}
        to={type === "channel" ? "/app/channels" : "/app/events"}
      >
        <span> View all {type}s</span> <ChevronRight size="14" />
      </Link>
    </div>
  );
}

export default function Content({ children, type }: ContentType) {
  return (
    <div className="space-y-1.5 flex flex-col w-full">
      <ContentHeader type={type} />
      {children}
    </div>
  );
}
