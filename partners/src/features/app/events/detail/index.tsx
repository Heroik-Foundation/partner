import { Fragment } from "react";
import { Header } from "../../global/header";
import { useEventDetailsQuery } from "../hooks/query";
import { Highlight } from "./modules/highlight";
import { Fallback } from "@/modules/units/suspense";
import { Link, useParams } from "@tanstack/react-router";
import Info from "./modules/info";
import { Manage } from "./modules/manage";
import { QrCode, Share2 } from "lucide-react";
import { Button, buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";

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

              <Button>
                <Share2 className="fill-white" />
              </Button>
            </div>
          ),
        }}
        previousButtonVariant="backlight"
      />
      {!event && <Fallback />}

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
