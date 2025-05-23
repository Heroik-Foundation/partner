import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { Link } from "@tanstack/react-router";
import { Trash, Edit } from "lucide-react";
import { useEventTerminationByIDMutation } from "../hooks/mutation";
import { ActionDrawer } from "@/modules/units/page/action";
import { toast } from "sonner";
import { isPastDate } from "@/helpers/time";

export const Manage = ({ id, endDate }: { id: string; endDate: string }) => {
  const { isPending, isSuccess, isError } = useEventTerminationByIDMutation({
    id,
  });

  return (
    <div className="space-y-2.5">
      <Link
        to={isPastDate(endDate) ? "/app/events/$id" : "/app/events/$id/edit"}
        className={cn(
          buttonVariants({
            size: "lg",
            className: "w-full",
          })
        )}
        params={{
          id,
        }}
        onClick={() => {
          if (isPastDate(endDate)) {
            toast.error("You can't edit a past event");
          }
        }}
      >
        <Edit size="16" />
        <span className="mt-0.5">Edit Event</span>
      </Link>

      <ActionDrawer
        trigger={
          <Button disabled size="lg" variant="destructive" className="w-full">
            <Trash size="16" />
            <span className="mt-0.5">Delete Event</span>
          </Button>
        }
        callback={{
          fn: () => {
            toast.info("Unauthorized to perform this action");
          },
          title: "Delete Event",
        }}
        title={{
          error: "Unable To Delete Event",
          initial: "Delete Event",
          pending: "Deleting Event",
          success: "Event Deleted",
        }}
        description="This action cannot be reversed, are you sure ?"
        isSuccess={isSuccess}
        isPending={isPending}
        isError={isError}
      />
    </div>
  );
};
