import { PageTitle } from "@/components/layout/page-title";
import { TableBase } from "@/components/table";
import { DatePicker } from "@/components/table/date-picker";
import { filterArrayByDateRange } from "@/helpers/array";
import { useAllOrganizations } from "@/hooks/fetch/organization";
import { useReports } from "@/hooks/fetch/reports";
import { useDateRangeState } from "@/hooks/store/data-range";
import { createLazyFileRoute } from "@tanstack/react-router";
import { columns } from "@/components/table/columns/charities";
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { api } from "@/lib/axios";
import { Filter } from "@/components/table/filter";
import { TableHeader, TableWrapper } from "@/components/layout/table-wrapper";

export const Route = createLazyFileRoute("/dashboard/charities/")({
  component: Page,
});

function Page() {
  const [searchValue, setSearchValue] = useState("");
  const [searchedRow, setSearchedRow] = useState([]);
  const [filter, setFilter] = useState<any>();
  const { data: reports } = useReports();
  const { startDate, endDate } = useDateRangeState();
  const { data, isPending, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useAllOrganizations({
      filter: filter,
    });
  const row = data?.pages ? data.pages.flat() : [];
  const filteredArray = filterArrayByDateRange(startDate, endDate, row);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function getSearchRequest() {
    if (searchValue !== "") {
      const { data } = await api(`/organizations?searchQuery=${searchValue}`, {
        method: "GET",
        authenticated: true,
      });

      setSearchedRow(data.data);
    }
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Charities" subTitle="View all charities" />

      <div className="flex items-start lg:items-center flex-col space-y-5 lg:space-y-0 lg:flex-row justify-between w-full">
        <DatePicker />
        <Link
          to="/dashboard/charities/create"
          className="py-2 bg-violet-500 text-white rounded text-sm font-medium inline-flex w-[210px] text-center"
        >
          <span className="w-full text-center">Create organization</span>
        </Link>
      </div>

      <TableWrapper>
        <TableHeader className="justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-medium">Organizations</h1>
            <h5 className="text-violet-700 bg-violet-500/5 py-1 px-2 rounded-full text-xs">
              {Number(reports?.charities).toLocaleString()} registered
            </h5>
          </div>
          <Filter
            state={filter}
            setState={setFilter}
            options={[
              { title: "Claimed accounts", value: "claimed" },
              { title: "Unclaimed accounts", value: "unclaimed" },
              { title: "Received donations", value: "with-donations" },
              { title: "Awaiting donations", value: "without-donations" },
            ]}
          />
        </TableHeader>
        <TableBase
          data={
            filteredArray && startDate
              ? filteredArray
              : searchedRow.length >= 1 && searchValue && searchValue.length > 2
                ? searchedRow
                : data
                  ? data.pages.flat()
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
