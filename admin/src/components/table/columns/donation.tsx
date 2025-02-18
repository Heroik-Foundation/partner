import { ColumnDef } from "@tanstack/react-table";
import { UnavailableMarker, SuccessMarker } from "./markers";
import { User } from "./user";
import { CharityOrganization } from "./charities";
import { formatDate } from "@/helpers/date-time";

export interface Donation {
  _id: string;
  user: User;
  amount: number;
  status: string;
  organization: CharityOrganization;
  event: string;
  subscriptionId: string;
  paymentIntentId: string;
  active: boolean;
  interval: string;
  donationStatus: string;
  createdAt: string;
}

export const columns: ColumnDef<Donation>[] = [
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
    header: () => <div className="text-start">Donor</div>,
    cell: ({ row }) => {
      const donation = row.original;
      const name = donation.user.fullname || donation.user.username || "-";

      return (
        <div className="text-start ">
          {name !== "" ? name : <UnavailableMarker />}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-start">Amount</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("amount")
          ? `£${Number(row.getValue("amount")) / 100}`
          : 0}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-start">Status</div>,
    cell: ({ row }) => {
      return (
        <div className="text-start">
          {row.original.status === "success" ? (
            <SuccessMarker />
          ) : (
            <UnavailableMarker />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "organization",
    header: () => <div className="text-start">Organization</div>,
    cell: ({ row }) => {
      const donation = row.original;

      return (
        <div className="text-start">
          {row.getValue("organization") ? donation.organization.name : "-"}
        </div>
      );
    },
  },
];

export const user_columns: ColumnDef<Donation>[] = [
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
    header: () => <div className="text-start">Amount</div>,
    cell: ({ row }) => (
      <div className="text-center ">
        {row.getValue("amount")
          ? `£${Number(row.getValue("amount")) / 100}`
          : 0}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: () => <div className="text-start">Status</div>,
    cell: ({ row }) => {
      return (
        <div className="text-start">
          {row.original.status === "success" ? (
            <SuccessMarker />
          ) : (
            <UnavailableMarker />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "organization",
    header: () => <div className="text-start">Organization</div>,
    cell: ({ row }) => {
      const donation = row.original;

      return (
        <div className="">
          {row.getValue("organization") ? donation.organization.name : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "event",
    header: () => <div className="text-start">Event Id</div>,
    cell: ({ row }) => (
      <div className="">
        {row.getValue("event") ? row.getValue("event") : "-"}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">Donated on</div>,
    cell: ({ row }) => {
      const donation = row.original;
      return (
        <div className="text-start">
          {row.getValue("createdAt") ? formatDate(donation.createdAt) : "-"}
        </div>
      );
    },
  },
];
