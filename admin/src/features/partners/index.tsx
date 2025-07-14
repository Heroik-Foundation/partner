import { PageTitle } from "@/components/layout/page-title";
import { TableHeader, TableWrapper } from "@/components/layout/table-wrapper";
import { TableBase } from "@/components/table";
import { useEventPartnersQuery } from "./hooks/query";
import { columns } from "./modules/columns";

export default function ManagePartnersPage() {
  const { data, isFetching, hasNextPage, fetchNextPage } =
    useEventPartnersQuery();
  const row: any[] = data?.pages.flat() || [];

  return (
    <div className="space-y-8">
      <PageTitle
        title="Event Partners"
        subTitle="View all event partners and verify their account creation requests"
        rightContent={<></>}
      />

      <TableWrapper>
        <TableHeader className="justify-betwe">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-medium">Partners list</h1>
          </div>
        </TableHeader>
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
    </div>
  );
}
