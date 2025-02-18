import { TableBase } from "@/components/table";
import { columns } from "@/components/table/columns/event";
import { useOrganizationEvents } from "@/hooks/fetch/organization";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import eventBadge from "@/assets/events/badges/events.svg";
import participantBadge from "@/assets/events/badges/participants.svg";
import donationBadge from "@/assets/events/badges/donations.svg";
import { Fragment } from "react/jsx-runtime";
import { TableWrapper } from "@/components/layout/table-wrapper";

export const Route = createLazyFileRoute("/dashboard/charities/$id/event")({
  component: Page,
});

function Page() {
  const { id } = useParams({
    strict: false,
  });

  const { data, hasNextPage, fetchNextPage, isFetching } =
    useOrganizationEvents({
      id: String(id),
    });
  const row = data?.pages ? data.pages.flat() : [];

  const cards = [
    {
      title: "Total event donations",
      data: 0,
      badge: donationBadge,
    },
    {
      title: "Total events created",
      data: 0,
      badge: eventBadge,
    },
    {
      title: "Total participation",
      data: 0,
      badge: participantBadge,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((item, index) => (
          <div
            key={index}
            className="w-full h-[100px] bg-white shadow rounded-xl p-4 relative mx-auto lg:mx-0"
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
      <TableWrapper className="pt-5">
        <TableBase
          data={row}
          columns={columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetching,
          }}
        />
      </TableWrapper>
    </Fragment>
  );
}
