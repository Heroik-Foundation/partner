import { PageTitle } from "@/components/layout/page-title";
import { TableHeader, TableWrapper } from "@/components/layout/table-wrapper";
import { TableBase } from "@/components/table";
import { columns } from "@/components/table/columns/contacts";
import { DatePicker } from "@/components/table/date-picker";
import { filterArrayByDateRange } from "@/helpers/array";
import { useContacts } from "@/hooks/fetch/platform";
import { useDateRangeState } from "@/hooks/store/data-range";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/dashboard/contacts/")({
  component: Page,
});

function Page() {
  const { startDate, endDate } = useDateRangeState();
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useContacts();
  const row = data?.pages ? data.pages.flat() : [];
  const filteredArray = filterArrayByDateRange(startDate, endDate, row);

  return (
    <div className="space-y-8">
      <PageTitle
        title="Contacts"
        subTitle="List of contacts who got in touch successfully retrieved"
      />
      <DatePicker />

      <TableWrapper>
        <TableHeader>
          <h1 className="text-lg font-medium">Contacts</h1>
        </TableHeader>
        <TableBase
          data={filteredArray && startDate ? filteredArray : row}
          columns={columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetchingNextPage || isPending,
          }}
        />
      </TableWrapper>
    </div>
  );
}
