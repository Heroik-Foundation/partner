import { PageTitle } from "@/components/layout/page-title";
import { TableBase } from "@/components/table";
import { columns } from "@/components/table/columns/updates";
import { filterArrayByDateRange } from "@/helpers/array";
import { useAppVersion } from "@/hooks/fetch/platform";
import { useDateRangeState } from "@/hooks/store/data-range";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import androidDark from "@/assets/platform/android-dark.svg";
import IOSDark from "@/assets/platform/ios-dark.svg";
import { create } from "zustand";
import { cn } from "@/lib/utils";
import { TableHeader, TableWrapper } from "@/components/layout/table-wrapper";

export const Route = createLazyFileRoute("/dashboard/update-logs/")({
  component: () => <Page />,
});

interface Platform {
  platform: "ios" | "android";
  setPlatform: (platform: "ios" | "android") => void;
}

export const useCurrentPlatform = create<Platform>((set) => ({
  platform: "ios",
  setPlatform: (platform: "ios" | "android") => set({ platform }),
}));

function Page() {
  const { platform, setPlatform } = useCurrentPlatform();
  const { data, isFetching } = useAppVersion({
    platform: platform,
  });
  const { startDate, endDate } = useDateRangeState();
  const row = data || [];
  const filteredArray = filterArrayByDateRange(startDate, endDate, row);

  return (
    <div className="space-y-8">
      <PageTitle title="Update logs" subTitle="View all logs" />

      <div className="mt-10">
        <Link
          to="/dashboard/update-logs/create"
          className="px-5 py-2 bg-violet-500 text-white rounded text-sm font-medium "
        >
          Create new log
        </Link>
      </div>

      <TableWrapper>
        <TableHeader>
          <h1 className="text-lg font-medium">Update logs</h1>
          <h5 className="text-violet-500 bg-violet-500/5 py-1 px-2 rounded-full text-xs font-medium">
            {data?.length || 0} log{data && data.length <= 1 ? "" : "s"}
          </h5>
        </TableHeader>

        <div className="inline-flex border rounded-md ml-5">
          <button
            className={cn(
              "flex items-center space-x-2 px-5 py-2 border-r",
              platform === "android" && "bg-neutral-200"
            )}
            onClick={() => setPlatform("android")}
          >
            <img src={androidDark} alt="" /> <span>Android</span>
          </button>
          <button
            className={cn(
              "flex items-center space-x-2 px-5 py-2",
              platform === "ios" && "bg-neutral-200"
            )}
            onClick={() => setPlatform("ios")}
          >
            <img src={IOSDark} alt="" /> <span>IOS</span>
          </button>
        </div>

        <TableBase
          data={filteredArray && startDate ? filteredArray : row}
          columns={columns}
          callback={{
            hasNextPage: false,
            isFetchingNextPage: isFetching,
            nextPage: () => {},
          }}
        />
      </TableWrapper>
    </div>
  );
}
