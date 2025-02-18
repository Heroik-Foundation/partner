import { TableBase } from "@/components/table";
import { user_columns } from "@/components/table/columns/donation";
import { useUserDonations, useUserStats } from "@/hooks/fetch/users";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import totalDonationsBadge from "@/assets/charities/total-donations.svg";
import directDonationsBadge from "@/assets/charities/direct-donations.svg";
import eventDonationsBadge from "@/assets/charities/event-donations.svg";
import donorsDonationsBadge from "@/assets/charities/total-donors.svg";
import { Fragment } from "react/jsx-runtime";

export const Route = createLazyFileRoute("/dashboard/users/$id/")({
  component: Page,
});

function Page() {
  const { id } = useParams({
    strict: false,
  });
  const { data, isFetching, hasNextPage, fetchNextPage } = useUserDonations({
    id: String(id),
  });
  const { data: stats } = useUserStats({
    id: id,
  });
  const row = data?.pages.flat() || [];

  const cards = [
    {
      title: "Total donations",
      data: stats?.totalDonations || 0,
      badge: totalDonationsBadge,
    },
    {
      title: "Direct donations",
      data: 0,
      badge: directDonationsBadge,
    },
    {
      title: "Event donations",
      data: 0,
      badge: eventDonationsBadge,
    },
    {
      title: "Total donation orgs",
      data: 0,
      badge: donorsDonationsBadge,
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
