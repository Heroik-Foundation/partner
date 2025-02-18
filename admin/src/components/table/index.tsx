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
  const paginationButtons: any[] = [];

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

  let start = table.getState().pagination.pageIndex;
  let end = Math.min(start + 5, table.getPageCount());

  if (end - start < 5) {
    start = Math.max(0, end - 5);
  }

  for (let i = start; i < end; i++) {
    paginationButtons.push(
      <PaginationItem
        key={i}
        onMouseEnter={() => {
          callback?.nextPage();
        }}
      >
        <Button
          variant={"outline"}
          onClick={() => {
            table.setPageIndex(i);
          }}
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
                  isActive={!table.getCanPreviousPage()}
                  className="cursor-pointer"
                />
              </PaginationItem>
              <div className="flex space-x-2">
                {paginationButtons.map((u) => u)}
                {table.getCanNextPage() && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </div>
              <PaginationItem>
                {callback?.hasNextPage && (
                  <PaginationNext
                    size={"default"}
                    onMouseEnter={() => {
                      callback?.nextPage();
                    }}
                    onClick={() => {
                      table.nextPage();
                      if (callback) {
                        callback.nextPage();
                      }
                    }}
                    isActive={!table.getCanNextPage() && callback?.hasNextPage}
                    className="cursor-pointer"
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </React.Fragment>
  );
}
