import { Fragment } from "react";
import { Header } from "../../global/header";
import { useEventDetailsQuery } from "../hooks/query";
import { Highlight } from "./modules/highlight";
import { Fallback } from "@/modules/ui/units/suspense";
import { useParams } from "@tanstack/react-router";
import Info from "./modules/info";
import { Manage } from "./modules/manage";

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
          scanner: true,
        }}
        previousButtonVariant="backlight"
      />
      {!event && <Fallback />}

      {event && id && (
        <Fragment>
          <Highlight
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
