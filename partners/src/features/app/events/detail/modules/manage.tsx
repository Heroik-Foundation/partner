import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";
import { Trash, Edit } from "lucide-react";

export const Manage = ({ id }: { id: string }) => {
  return (
    <div className="space-y-2.5">
      <Link
        to="/app/events/$id/edit"
        className={cn(
          buttonVariants({
            size: "lg",
            className: "w-full",
          })
        )}
        params={{
          id,
        }}
      >
        <Edit size="16" />
        <span className="mt-0.5">Edit Event</span>
      </Link>

      <Button disabled size="lg" variant="destructive" className="w-full">
        <Trash size="16" />
        <span className="mt-0.5">Delete Event</span>
      </Button>
    </div>
  );
};
