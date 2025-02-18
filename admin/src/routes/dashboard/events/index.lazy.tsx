import { PageTitle } from "@/components/layout/page-title";
import { TableBase } from "@/components/table";
import { DatePicker } from "@/components/table/date-picker";
import { createLazyFileRoute } from "@tanstack/react-router";
import { columns } from "@/components/table/columns/event";
import { useReports } from "@/hooks/fetch/reports";
import { TimeFrame, useAllEvents } from "@/hooks/fetch/event";
import { filterArrayByDateRange } from "@/helpers/array";
import { useDateRangeState } from "@/hooks/store/data-range";
import donationBadge from "@/assets/events/badges/donations.svg";
import donorBadge from "@/assets/events/badges/donors.svg";
import eventBadge from "@/assets/events/badges/events.svg";
import participantBadge from "@/assets/events/badges/participants.svg";
import { useState } from "react";
import { Filter } from "@/components/table/filter";
import { TableHeader, TableWrapper } from "@/components/layout/table-wrapper";

export const Route = createLazyFileRoute("/dashboard/events/")({
  component: Page,
});

function Page() {
  const [time, setTime] = useState<TimeFrame>("");
  const { data: reports } = useReports();
  const { startDate, endDate } = useDateRangeState();
  const { data, hasNextPage, fetchNextPage, isFetching } = useAllEvents({
    time: time,
  });
  const row = data?.pages ? data.pages.flat() : [];
  const filteredArray = filterArrayByDateRange(startDate, endDate, row);

  const cards = [
    {
      title: "Total event donations",
      data: 0,
      badge: donationBadge,
    },
    {
      title: "Total events created",
      data: reports?.events || 0,
      badge: eventBadge,
    },
    {
      title: "Event Donors",
      data: 0,
      badge: donorBadge,
    },
    {
      title: "Total participation",
      data: 0,
      badge: participantBadge,
    },
  ];

  const filterOptions = [
    {
      title: "All",
      value: "",
    },
    {
      title: "Upcoming events",
      value: "future",
    },
    {
      title: "Ongoing events",
      value: "present",
    },
    {
      title: "Past events",
      value: "past",
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle title="Events" subTitle="View all events" />
      <DatePicker />

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

      <TableWrapper>
        <TableHeader className="justify-between">
          <h1 className="text-lg font-medium">Events</h1>
          <Filter options={filterOptions} setState={setTime} state={time} />
        </TableHeader>
        <TableBase
          data={filteredArray && startDate ? filteredArray : row}
          columns={columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetching,
          }}
        />
      </TableWrapper>
    </div>
  );
}
