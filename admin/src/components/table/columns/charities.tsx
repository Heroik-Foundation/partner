"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatReadableDate } from "@/helpers/date-time";
import { useRouter } from "@tanstack/react-router";
import { User } from "./user";
import { SuccessMarker } from "./markers";

export interface CharityOrganization {
  _id: string;
  userId: string;
  name: string;
  logo: string;
  charityRegNumber: string;
  fundRaised: number;
  email: string;
  postalCode: string;
  country: string;
  city: string;
  address: string;
  loc: {
    coordinates: number[];
    type: string;
  };
  interests: string[];
  description: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
  createdAt: Date;
  totalDonations: number | any;
}

export interface CharityOrganizationDonations {
  _id: string;
  user: User;
  amount: 0;
  status: "string";
  organization: "string";
  event: "string";
  subscriptionId: "string";
  paymentIntentId: "string";
  active: true;
  interval: "string";
  donationStatus: "string";
}

export interface CharityOrganizationWithdrawalLogs {
  organization: {
    name: string;
    charityRegNumber: string;
    email: string;
    postalCode: string;
    country: string;
    city: string;
    address: string;
    loc: {
      type: "Point";
      coordinates: [number, number];
    };
    interests: string[];
    subcategories: string[];
    description: string;
    bankAccountName: string;
    bankAccountNumber: string;
    bankName: string;
    sortCode: string;
    fundRaised: string;
    totalDonations: string;
    incomeCategory: string;
    annualIncome: string;
    accountClaimed: boolean;
    latitude: string;
    longitude: string;
  };
  amount: number;
}

export const columns: ColumnDef<CharityOrganization>[] = [
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
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("name") ? (
          <div className="flex space-x-2 items-center">
            <div className="min-w-10 min-h-10 bg-violet-500/10 rounded-full flex items-center justify-center">
              <span className="text-sm text-violet-700">
                {String(row.getValue("name"))[0]}
              </span>
            </div>

            <h3 className="text-sm font-medium">{row.getValue("name")}</h3>
          </div>
        ) : (
          ""
        )}
      </div>
    ),
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
    accessorKey: "totalDonations",
    header: () => <div className="text-start">Donations received</div>,
    cell: ({ row }) => (
      <div className="text-start font-medium">
        {row.getValue("totalDonations")
          ? `£ ${Number(row.getValue("totalDonations")) / 100}`
          : "£ 0"}
      </div>
    ),
  },

  {
    accessorKey: "charityRegNumber",
    header: "Registration Number",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("charityRegNumber")
          ? row.getValue("charityRegNumber")
          : ""}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">Created at</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("createdAt")
          ? formatReadableDate(row.getValue("createdAt"))
          : ""}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const organization = row.original;
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
                  to: "/dashboard/charities/$id",
                  params: {
                    id: organization._id,
                  },
                });
              }}
            >
              <Pencil size={18} /> <span className="text-base">Manage org</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const donation_columns: ColumnDef<CharityOrganizationDonations>[] = [
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("amount") ? row.getValue("amount") : ""}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Donation type",
    cell: () => <SuccessMarker text="Direct" />,
  },
  {
    accessorKey: "user",
    header: "Donor",
    cell: ({ row }) => {
      const user = row.original.user;
      const donor = user.fullname || user.username || user.email;
      return <div className="capitalize">{user ? donor : ""}</div>;
    },
  },
  {
    accessorKey: "event",
    header: "Event",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("event") ? row.getValue("event") : ""}
      </div>
    ),
  },
];

export const logs_columns: ColumnDef<CharityOrganizationWithdrawalLogs>[] = [
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("amount") ?? ""}</div>
    ),
  },
  {
    accessorKey: "name",
    header: "Initiated by",
    cell: ({ row }) => {
      const log = row.original;

      return <div className="capitalize">{log.organization.name ?? ""}</div>;
    },
  },
];
