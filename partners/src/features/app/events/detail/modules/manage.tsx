import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/modules/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Edit, Copy, Trash } from "lucide-react";
// import { useEventTerminationByIDMutation } from "../hooks/mutation";
// import { ActionDrawer } from "@/modules/units/page/action";
// import { toast } from "sonner";
import { isPastDate } from "@/helpers/time";
import { useEventFormStore } from "@/features/app/global/hooks/logic";
import { Event } from "@/features/app/global/types";
import { safeExtractDate, safeGetTimeFromISO } from "../../edit/helpers/time";
import { getSafeCoordinate } from "../../edit/helpers/location";
import { useCurrencyStore } from "@/stores/currency";
import { ActionDrawer } from "@/modules/units/page/action";
import { toast } from "sonner";
import { useEventTerminationByIDMutation } from "../hooks/mutation";

export const Manage = ({
  id,
  endDate,
  event,
}: {
  id: string;
  endDate: string;
  event: Event;
}) => {
  const { isPending, isSuccess, isError } = useEventTerminationByIDMutation({
    id,
    isRefundable: event.isRefundable,
  });
  const { setSelectedCurrency, getSymbolByValue } = useCurrencyStore();
  const { setFormState } = useEventFormStore();
  const navigate = useNavigate();
  const isPastEvent = isPastDate(endDate);

  const handleEventDuplication = () => {
    const startTime = safeGetTimeFromISO(event.endTime);
    const endTime = safeGetTimeFromISO(event.eventEndDate);

    const startDate = safeExtractDate(event.endTime);
    const endDate = safeExtractDate(event.eventEndDate);

    const longitude = getSafeCoordinate(event.loc?.coordinates, 0);
    const latitude = getSafeCoordinate(event.loc?.coordinates, 1);

    const currency = event.currency;
    const currencySymbol = getSymbolByValue(event.currency);

    if (currencySymbol) {
      setSelectedCurrency({
        symbol: currencySymbol,
        value: currency,
      });
    }

    const isOnlineEvent = event.meetingLink ? true : false;

    const locationDetails: any = event.meetingLink
      ? { meetingLink: event.meetingLink }
      : {
          address: event.address,
          longitude,
          latitude,
        };

    setFormState({
      name: event.name,
      ...locationDetails,
      isOnlineEvent,
      category: {
        id: event.category._id,
        image: event.category.image,
        name: event.category.name,
      },
      absorbFees: event.absorbFees,
      description: event.description,
      endDate,
      startDate,
      startTime,
      endTime,
      photo: event.photo,
      eventId: event._id,
      privacy: event.privacy,
      currentTicketIndex: 1,
      ...(event.ticketing && {
        ticketing: event.ticketing.map((ticket) => ({
          ...ticket,
          ticketPrice: Math.abs(Number(ticket.ticketPrice / 100)),
          salesStartDate: safeExtractDate(ticket.salesStartDate),
          salesEndDate: safeExtractDate(ticket.salesEndDate),
        })),
      }),
      ...(event.eventPledge &&
        event.eventPledge.organizations &&
        event.eventPledge.minimumPledge && {
          fundRaiser: {
            fundRaisingGoal: Math.abs(
              Number(event.eventPledge.minimumPledge / 100),
            ),
            organizations: event.eventPledge.organizations.map(
              (organization) => ({
                name: organization.name,
                id: organization._id,
              }),
            ),
          },
        }),
      ...(event.recurrence && {
        recurrence: event.recurrence as any,
      }),
    });

    navigate({
      to: "/app/events/create",
    });
  };

  return (
    <div className="space-y-2.5 sm:space-y-0 flex flex-col sm:flex-row items-center sm:space-x-2.5">
      <Link
        to={"/app/events/$id/edit"}
        className={cn(
          buttonVariants({
            size: "lg",
            className: "w-full",
          }),
        )}
        params={{
          id,
        }}
      >
        <Edit size="16" />
        <span className="mt-0.5">Edit Event</span>
      </Link>

      <ActionDrawer
        trigger={
          <Button size="lg" variant="destructive" className="w-full">
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

      {isPastEvent && (
        <Button
          onClick={handleEventDuplication}
          className="w-full"
          size={"lg"}
          variant={"secondary"}
        >
          Duplicate Event <Copy />
        </Button>
      )}
    </div>
  );
};
