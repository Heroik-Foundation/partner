import { PageTitle } from "@/components/layout/page-title";
import { DatePicker } from "@/components/table/date-picker";
import { useReports } from "@/hooks/fetch/reports";
import { useAllUsers } from "@/hooks/fetch/users";
import { useDateRangeState } from "@/hooks/store/data-range";
import { createLazyFileRoute } from "@tanstack/react-router";
import { columns } from "@/components/table/columns/user";
import { TableBase } from "@/components/table";
import { filterArrayByDateRange } from "@/helpers/array";
import { useRef, useState } from "react";
import { api } from "@/lib/axios";
import { TableHeader, TableWrapper } from "@/components/layout/table-wrapper";

export const Route = createLazyFileRoute("/dashboard/users/")({
  component: Page,
});

function Page() {
  const [searchValue, setSearchValue] = useState("");
  const [searchedRow, setSearchedRow] = useState([]);
  const { data: reports } = useReports();
  const { startDate, endDate } = useDateRangeState();
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAllUsers();
  const row = data?.pages ? data.pages.flat() : [];
  const filteredArray = filterArrayByDateRange(startDate, endDate, row);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function getSearchRequest() {
    if (searchValue !== "") {
      const { data } = await api.get(`/users?query=${searchValue}`);

      setSearchedRow(data.data);
    }
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Users" subTitle="View all users" />
      <DatePicker />

      <TableWrapper>
        <TableHeader>
          <h1 className="text-lg font-medium">Users</h1>
          <h5 className="text-violet-700 bg-violet-500/5 py-1 px-2 rounded-full text-xs font-medium">
            {Number(reports?.users).toLocaleString()} registered
          </h5>
        </TableHeader>
        <TableBase
          data={
            filteredArray && startDate
              ? filteredArray
              : searchedRow.length >= 1 &&
                  searchValue !== "" &&
                  searchValue.length > 2
                ? searchedRow
                : data
                  ? row
                  : []
          }
          columns={columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetchingNextPage || isPending,
          }}
          input={{
            value: searchValue,
            onChange: (event) => {
              setSearchValue(event.target.value);
            },
            onBlur: getSearchRequest,
            ref: inputRef,
          }}
        />
      </TableWrapper>
    </div>
  );
}
