import { ColumnDef } from "@tanstack/react-table";

export interface Contacts {
  fullname: string;
  email: string;
  organizationName: string;
  message: string;
}

export const columns: ColumnDef<Contacts>[] = [
  {
    accessorKey: "SN",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-center">
        {Number(row.index) + 1}
      </div>
    ),
  },
  {
    accessorKey: "fullname",
    header: "Name",
    cell: ({ row }) => row.getValue("fullname") || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email") || "-",
  },
  {
    accessorKey: "organizationName",
    header: "Organization Name",
    cell: ({ row }) => row.getValue("organizationName") || "-",
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => row.getValue("message") || "-",
  },
];
