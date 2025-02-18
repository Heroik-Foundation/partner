import { useParams } from "@tanstack/react-router";
import { Header } from "../../global/header";

import { Fragment } from "react/jsx-runtime";
import { Stats } from "./modules/stats";
import { useEventStatsQuery } from "./hooks/query";
import { Fallback } from "@/modules/ui/units/suspense";
import { TicketSales } from "./modules/tickets";

const EventDashboard = () => {
  const { id } = useParams({ strict: false });
  const { data: stats } = useEventStatsQuery({ id });

  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "Event Dashboard",
          position: "inline",
        }}
      />
      {!stats && <Fallback />}
      {stats && id && (
        <Fragment>
          <Stats
            pledge={stats.fundRaisingGoal}
            signups={stats.members}
            ticket={{
              revenue: stats.fundRaised,
              sold: stats.tickets || 0,
            }}
          />
          <TicketSales />
        </Fragment>
      )}
    </div>
  );
};

export default EventDashboard;
