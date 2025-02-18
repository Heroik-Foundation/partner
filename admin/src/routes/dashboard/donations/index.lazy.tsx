import { PageTitle } from "@/components/layout/page-title";
import { TableHeader, TableWrapper } from "@/components/layout/table-wrapper";
import { TableBase } from "@/components/table";
import { columns } from "@/components/table/columns/donation";
import { DatePicker } from "@/components/table/date-picker";
import { filterArrayByDateRange } from "@/helpers/array";
import { useAllDonations } from "@/hooks/fetch/donation";
import { useDateRangeState } from "@/hooks/store/data-range";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/donations/")({
  component: Page,
});

function Page() {
  const { data, isFetching, hasNextPage, fetchNextPage } = useAllDonations();
  const { startDate, endDate } = useDateRangeState();
  const row = data?.pages.flat() || [];
  const filteredArray = filterArrayByDateRange(startDate, endDate, row);

  return (
    <div className="space-y-8">
      <PageTitle title="Donations" subTitle="View all donations" />
      <DatePicker />

      <TableWrapper>
        <TableHeader className="justify-betwe">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-medium">Donations</h1>
          </div>
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
