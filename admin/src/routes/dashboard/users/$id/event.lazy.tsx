import { TableBase } from "@/components/table";
import { user_columns } from "@/components/table/columns/event";
import { useUserEvents, useUserStats } from "@/hooks/fetch/users";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import totalEventsDonationsBadge from "@/assets/user/user-event-donations.svg";
import totalEventsCreatedBadge from "@/assets/user/user-created-events.svg";
import totalJoinedEventsBadge from "@/assets/user/user-joined-events.svg";
import totalParticipationBadge from "@/assets/user/user-total-participation.svg";
import { Fragment } from "react/jsx-runtime";

export const Route = createLazyFileRoute("/dashboard/users/$id/event")({
  component: Page,
});

export function Page() {
  const { id } = useParams({
    strict: false,
  });
  const { data, isFetching, hasNextPage, fetchNextPage } = useUserEvents({
    id: String(id),
  });
  const { data: stats } = useUserStats({
    id: id,
  });
  const row = data?.pages.flat() || [];

  const cards = [
    {
      title: "Total event donations",
      data: stats?.totalDonations || 0,
      badge: totalEventsDonationsBadge,
    },
    {
      title: "Total event created",
      data: 0,
      badge: totalEventsCreatedBadge,
    },
    {
      title: "Event joined",
      data: 0,
      badge: totalJoinedEventsBadge,
    },
    {
      title: "Total participation",
      data: 0,
      badge: totalParticipationBadge,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((item, index) => (
          <div
            key={index}
            className="w-full lg:w-[260px] h-[100px] bg-white shadow rounded-xl p-4 relative mx-auto lg:mx-0"
          >
            <div className="font-cairo flex flex-col h-full justify-between">
              <span className="text-muted-foreground">{item.title}</span>
              <h3 className="text-3xl font-semibold">
                {Number(item.data).toLocaleString()}
              </h3>
            </div>
            <img
              className="absolute right-4 top-4"
              src={item.badge}
              alt="Badge icon"
            />
          </div>
        ))}
      </div>
      <div className="bg-white shadow border rounded-lg pt-5">
        <TableBase
          data={row}
          columns={user_columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetching,
          }}
        />
      </div>
    </Fragment>
  );
}
