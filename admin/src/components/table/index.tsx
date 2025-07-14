import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { LoadingSpinner } from "../ui/loading";
import { Input } from "../ui/input";

export function TableBase<TData>({
  data,
  columns,
  callback,
  input,
}: {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  callback?: {
    nextPage: () => void;
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
  };
  input?: {
    value: any;
    onChange: (event: any) => void;
    onBlur: () => void;
    ref: any;
  };
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    autoResetPageIndex: false,
  });

  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  // Preload next 3 pages when we're getting close to the end
  React.useEffect(() => {
    if (callback?.hasNextPage && !callback.isFetchingNextPage) {
      // Calculate how many pages ahead we should preload (up to 3)
      const pagesFromEnd = pageCount - currentPage;

      // Start preloading when we're within 4 pages of the current end
      if (pagesFromEnd <= 4) {
        // Trigger multiple fetches to get 3 pages ahead
        const fetchNext = async () => {
          for (let i = 0; i < 3 && callback.hasNextPage; i++) {
            if (!callback.isFetchingNextPage) {
              callback.nextPage();
            }
          }
        };
        fetchNext();
      }
    }
  }, [currentPage, pageCount, callback]);

  // Generate pagination buttons
  const paginationButtons: React.ReactNode[] = [];
  let start = Math.max(0, currentPage - 2);
  let end = Math.min(start + 5, pageCount);

  // Adjust start if we don't have enough pages at the end
  if (end - start < 5) {
    start = Math.max(0, end - 5);
  }

  for (let i = start; i < end; i++) {
    paginationButtons.push(
      <PaginationItem key={i}>
        <Button
          variant={i === currentPage ? "default" : "outline"}
          onClick={() => {
            table.setPageIndex(i);
            // Preload next 3 pages if we're getting close to the end
            if (callback?.hasNextPage && !callback.isFetchingNextPage) {
              const pagesFromEnd = pageCount - i;
              if (pagesFromEnd <= 4) {
                const fetchNext = async () => {
                  for (let j = 0; j < 3 && callback.hasNextPage; j++) {
                    if (!callback.isFetchingNextPage) {
                      callback.nextPage();
                      await new Promise((resolve) => setTimeout(resolve, 50));
                    }
                  }
                };
                fetchNext();
              }
            }
          }}
          className="cursor-pointer"
        >
          {i + 1}
        </Button>
      </PaginationItem>
    );
  }

  return (
    <React.Fragment>
      <div className="w-full">
        {input && (
          <div className="flex items-center p-4">
            <Input
              placeholder="Filter by name..."
              value={
                input?.value
                  ? input.value
                  : ((table.getColumn("name")?.getFilterValue() as string) ??
                    "")
              }
              onChange={(event) => {
                if (input) {
                  input.onChange(event);
                  input.onBlur();
                } else {
                  table.getColumn("name")?.setFilterValue(event.target.value);
                }
              }}
              ref={input?.ref}
              className="max-w-sm"
            />
          </div>
        )}
        <div className="rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b transition-colors data-[state=selected]:bg-muted text-sm even:bg-neutral-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {callback?.isFetchingNextPage ? (
                      <LoadingSpinner />
                    ) : (
                      "No data."
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-x-2 p-4">
          <Pagination className="w-full transition-all">
            <PaginationContent className="transition-all justify-between flex items-center w-full">
              <PaginationItem>
                <PaginationPrevious
                  size={"default"}
                  onClick={() => table.previousPage()}
                  className={`cursor-pointer ${
                    !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  style={{
                    pointerEvents: !canPreviousPage ? "none" : "auto",
                  }}
                />
              </PaginationItem>

              <div className="flex space-x-2">
                {paginationButtons}
                {(canNextPage || callback?.hasNextPage) && pageCount > 5 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </div>

              <PaginationItem>
                <PaginationNext
                  size={"default"}
                  onClick={() => {
                    if (canNextPage) {
                      table.nextPage();

                      if (
                        callback?.hasNextPage &&
                        !callback.isFetchingNextPage
                      ) {
                        const pagesFromEnd = pageCount - (currentPage + 1);
                        if (pagesFromEnd <= 4) {
                          const fetchNext = async () => {
                            for (
                              let i = 0;
                              i < 3 && callback.hasNextPage;
                              i++
                            ) {
                              if (!callback.isFetchingNextPage) {
                                callback.nextPage();
                                await new Promise((resolve) =>
                                  setTimeout(resolve, 50)
                                );
                              }
                            }
                          };
                          fetchNext();
                        }
                      }
                    }
                  }}
                  onMouseEnter={() => {
                    // Preload on hover for even smoother experience
                    if (callback?.hasNextPage && !callback.isFetchingNextPage) {
                      const pagesFromEnd = pageCount - currentPage;
                      if (pagesFromEnd <= 5) {
                        const fetchNext = async () => {
                          for (let i = 0; i < 2 && callback.hasNextPage; i++) {
                            if (!callback.isFetchingNextPage) {
                              callback.nextPage();
                              await new Promise((resolve) =>
                                setTimeout(resolve, 50)
                              );
                            }
                          }
                        };
                        fetchNext();
                      }
                    }
                  }}
                  className={`cursor-pointer ${
                    !canNextPage && !callback?.hasNextPage
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  style={{
                    pointerEvents:
                      !canNextPage && !callback?.hasNextPage ? "none" : "auto",
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </React.Fragment>
  );
}
