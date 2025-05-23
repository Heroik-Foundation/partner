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
import { toast } from "sonner";

const EventDetail = () => {
  const { id } = useParams({
    strict: false,
  });
  const { data: event } = useEventDetailsQuery({ id });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.name,
          text: event?.description,
          url: `partners.hiroek.io/share/${id}`,
        });
        console.log("Shared successfully");
      } catch (error) {
        toast.error("Error sharing");
      }
    } else {
      toast.error("Web Share API is not supported in this browser.");
    }
  };

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

              <Button className="z-10" onClick={handleShare}>
                <Share2 className="fill-white" />
              </Button>
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
            date={event.endTime}
            avatars={event.members.map((member) => member.photo)}
            location={event.address}
          />
          <Info
            startDate={event.endTime}
            description={event.description}
            id={id}
            organizations={event.eventPledge.organizations.map(
              (organization) => organization.name
            )}
            percentage={event.eventPledge.totalPledgedAmount}
            minimumPledge={event.eventPledge.minimumPledge}
          />
          <Manage id={id} endDate={event.endTime} />
        </Fragment>
      )}
    </div>
  );
};

export default EventDetail;
