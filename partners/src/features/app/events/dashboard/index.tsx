import { useParams } from "@tanstack/react-router";
import { Header } from "../../global/header";

import { Fragment } from "react/jsx-runtime";
import { Stats } from "./modules/stats";
import { useEventStatsQuery } from "./hooks/query";
import { Fallback } from "@/modules/units/page/suspense";
import { TicketSales } from "./modules/tickets";

const EventDashboard = () => {
  const { id } = useParams({ strict: false });
  const { data: stats } = useEventStatsQuery({ id });

  console.log();

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
            todayDonations={stats.todayDonations}
            pledge={Number(stats.pledges || 0)}
            signups={stats.members}
            ticket={{
              revenue: Number(stats.ticketValues || 0),
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
