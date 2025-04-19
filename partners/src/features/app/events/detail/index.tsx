import { Fragment } from "react";
import { Header } from "../../global/header";
import { useEventDetailsQuery } from "../hooks/query";
import { Highlight } from "./modules/highlight";

import { Link, useParams } from "@tanstack/react-router";
import Info from "./modules/info";
import { Manage } from "./modules/manage";
import { QrCode, Share2 } from "lucide-react";
import { buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import { SuspenseLoader } from "@/modules/units/page/suspense";

const EventDetail = () => {
  const { id } = useParams({
    strict: false,
  });
  const { data: event } = useEventDetailsQuery({ id });

  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "",
          position: "inline",
        }}
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
                  })
                )}
              >
                <span>Scan Tickets</span>
                <QrCode size="16" />
              </Link>

              <Link
                to="/app/events/$id/share"
                params={{
                  id: String(id),
                }}
                className={cn(
                  buttonVariants({
                    variant: "default",
                    className: "z-10",
                  })
                )}
              >
                <Share2 className="fill-white" />
              </Link>
            </div>
          ),
        }}
        previousButtonVariant="backlight"
      />
      {!event && <SuspenseLoader />}

      {event && id && (
        <Fragment>
          <Highlight
            availableTickets={event.eventTicket.availableTickets}
            title={event.name}
            thumbnail={event.photo}
            members={event.members.length}
            date={event.eventEndDate}
            avatars={event.members.map((member) => member.photo)}
            location={event.address}
          />
          <Info
            description={event.description}
            id={id}
            percentage={event.eventPledge.totalPledgedAmount}
            minimumPledge={event.minimumPledge}
          />
          <Manage id={id} />
        </Fragment>
      )}
    </div>
  );
};

export default EventDetail;
