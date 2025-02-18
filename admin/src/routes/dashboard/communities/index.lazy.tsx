import { PageTitle } from "@/components/layout/page-title";
import { TableBase } from "@/components/table";
import { DatePicker } from "@/components/table/date-picker";
import { createLazyFileRoute } from "@tanstack/react-router";
import { columns } from "@/components/table/columns/community";
import { useReports } from "@/hooks/fetch/reports";
import { useAllCommunities } from "@/hooks/fetch/community";
import { useDateRangeState } from "@/hooks/store/data-range";
import { filterArrayByDateRange } from "@/helpers/array";
import pencilBadge from "@/assets/communities/badges/pencil.svg";
import userCheckBadge from "@/assets/communities/badges/user-check.svg";
import userHeartBadge from "@/assets/communities/badges/user-heart.svg";
import usersBadge from "@/assets/communities/badges/users.svg";
import { TableWrapper } from "@/components/layout/table-wrapper";

export const Route = createLazyFileRoute("/dashboard/communities/")({
  component: Page,
});

function Page() {
  const { data: reports } = useReports();
  const { startDate, endDate } = useDateRangeState();
  const { data, isFetching, hasNextPage, fetchNextPage } = useAllCommunities();
  const row = data?.pages ? data.pages.flat() : [];
  const filteredArray = filterArrayByDateRange(startDate, endDate, row);

  const cards = [
    {
      title: "Total event donations",
      data: reports?.communities || 0,
      badge: usersBadge,
    },
    {
      title: "Total users created",
      data: reports?.users || 0,
      badge: userCheckBadge,
    },
    {
      title: "Total comm creators",
      data: 0,
      badge: userHeartBadge,
    },
    {
      title: "Total posts",
      data: reports?.posts || 0,
      badge: pencilBadge,
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle title="Communities" subTitle="View all communities" />
      <DatePicker />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((item, index) => (
          <div
            key={index}
            className="w-full lg:w-[260px] h-[100px] bg-white shadow rounded-xl p-4 relative mx-auto lg:mx-0"
          >
            <div className="font-cairo flex flex-col h-full justify-between">
              <span className="text-muted-foreground">{item.title}</span>
              <h3 className="text-3xl font-semibold">{item.data}</h3>
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
