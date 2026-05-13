import { Fragment } from "react";
import { Header } from "../../global/header";
import { useEventDetailsQuery } from "../hooks/query";
import { Highlight } from "./modules/highlight";

import { Link, useParams } from "@tanstack/react-router";
import Info from "./modules/info";
import { Manage } from "./modules/manage";
import { QrCode, Share2 } from "lucide-react";
import { Button, buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import { SuspenseLoader } from "@/modules/units/page/suspense";
import { useRouteStore } from "@/hooks/router";
import { ShareDialog } from "@/modules/units/page/share";
import { Tickets } from "./modules/tickets";
import { EventCountdown } from "./modules/countdown";

const EventDetail = () => {
  const { id } = useParams({
    strict: false,
  });
  const { data: event } = useEventDetailsQuery({ id });

  const { previousPath } = useRouteStore();
  const backRoute = previousPath === "/app/events" ? "/app/events" : "/app";

  let ticketsAvailable = 0;

  if (Array.isArray(event?.ticketing)) {
    const hasZeroSignUpLimit = event.ticketing.some(
      (obj) => obj.signUpLimit === 0,
    );

    if (!hasZeroSignUpLimit) {
      ticketsAvailable = event.ticketing.reduce(
        (sum, obj) => sum + (obj.spotsLeft || 0),
        0,
      );
    }
  }

  const isFundraiser =
    (
      event?.fundRaiser.organizations.map(
        (organization) => organization.name,
      ) || []
    ).length >= 1;

  return (
    <div className="space-y-5 lg:space-y-10">
      <Header
        header={{
          title: "",
          position: "inline",
        }}
        previousButtonRoute={backRoute}
        addOns={{
          content: (
            <div className="flex items-center space-x-1">
              <Link
                to="/app/tickets/scan"
                className={cn(
                  buttonVariants({
                    variant: "default",
                    className:
                      "bg-white text-primary font-bold z-10 hover:bg-white rounded-lg px-5 items-center",
                  }),
                )}
              >
                <span>Scan Tickets</span>
                <QrCode size="16" />
              </Link>

              <ShareDialog
                dialogTitle="Share this event"
                title={event?.name}
                description={event?.description}
                url={`https://events.hiroek.io/event/${event?._id}`}
                trigger={
                  <Button className="z-10">
                    <Share2 className="fill-white" />
                  </Button>
                }
              />
            </div>
          ),
        }}
        previousButtonVariant="backlight"
      />
      {!event && <SuspenseLoader />}

      {event && id && (
        <Fragment>
          <Highlight
            currency={event.currency}
            availableTickets={ticketsAvailable}
            title={event.name}
            thumbnail={event.photo || ""}
            members={event.members.length}
            date={event.endTime}
            avatars={event.members.map((member) => member.photo)}
            {...(event.meetingLink
              ? { meetingLink: event.meetingLink || "" }
              : { location: event.address || "" })}
          />
          <Info
            currency={event.currency}
            startDate={event.endTime}
            description={event.description}
            id={id}
            organizations={event.fundRaiser.organizations.map(
              (organization) => organization.name,
            )}
          />
          <Tickets
            donationAmount={event.fundRaiser.fundRaised}
            currency={event.currency}
            eventId={id}
            tickets={event.ticketing}
            isFundraiser={isFundraiser}
          />
          {!isFundraiser && <EventCountdown startDate={event.endTime} />}
          <Manage id={id} endDate={event.endTime} event={event} />
        </Fragment>
      )}
    </div>
  );
};

export default EventDetail;
