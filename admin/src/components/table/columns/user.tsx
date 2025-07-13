"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil, User, UserRound } from "lucide-react";
import { formatReadableDate } from "@/helpers/date-time";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface User {
  _id: string;
  fullname: string;
  username: string;
  phone: string;
  photo: string;
  birthDate: string;
  callingCode: string;
  isAdmin: boolean;
  blocked: boolean;
  isAccountSetup: boolean;
  createdAt: Date;
  role: string;
  loc: {
    type: string;
    coordinates: [number, number];
  };
  email: string;
  interest: string[];
  followers: string[];
  following: string[];
}

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <>
          {user.fullname ? (
            <div className="flex space-x-2 items-center">
              <div className="min-w-10 min-h-10 bg-violet-500/10 rounded-full flex items-center justify-center">
                <UserRound className="stroke-violet-700" size={16} />
              </div>
              <div>
                <h3 className="text-sm font-medium">{user.fullname}</h3>
                <span className="text-sm">{user.role}</span>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="text-start font-medium">
          {row.getValue("phone")
            ? `(+${user.callingCode})  ${row.getValue("phone")}`
            : ""}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue("email") ? row.getValue("email") : ""}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">Joined</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("createdAt")
          ? formatReadableDate(row.getValue("createdAt"))
          : "-"}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      const { navigate } = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-transparent border-none shadow-none"
            align="end"
          >
            <DropdownMenuItem
              className="flex cursor-pointer space-x-3 bg-indigo-800 text-white rounded-xl p-5 font-cairo"
              onClick={() => {
                navigate({
                  to: "/dashboard/users/$id",
                  params: {
                    id: user._id,
                  },
                });
              }}
            >
              <Pencil size={18} />{" "}
              <span className="text-base">Manage User</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
