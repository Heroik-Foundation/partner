import { TableWrapper } from "@/components/layout/table-wrapper";
import { TableBase } from "@/components/table";
import { logs_columns } from "@/components/table/columns/charities";
import {
  useOrganizationStats,
  useOrganizationWithdrawalLogs,
} from "@/hooks/fetch/organization";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export const Route = createLazyFileRoute("/dashboard/charities/$id/wallet")({
  component: Page,
});

function Page() {
  const { id } = useParams({
    strict: false,
  });

  const { data } = useOrganizationStats({
    id: id,
  });

  const {
    data: logs,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isPending,
  } = useOrganizationWithdrawalLogs({
    id: String(id),
  });
  const row = logs?.pages ? logs.pages.flat() : [];

  return (
    <Fragment>
      <div className="bg-white w-full h-[150px] rounded-xl shadow p-5 space-y-1">
        <span className="font-cairo font-medium text-muted-foreground">
          Wallet Balance
        </span>
        <h1 className="text-5xl font-cairo">
          £ {Math.ceil(Number(data?.walletBalance) / 100) || 0}
        </h1>
      </div>

      <TableWrapper className="pt-5">
        <TableBase
          data={row}
          columns={logs_columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetchingNextPage || isPending,
          }}
        />
      </TableWrapper>
    </Fragment>
  );
}
