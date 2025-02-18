import { formatDate, formatReadableDate } from "@/helpers/date-time";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarRange, MoreVertical, Pencil } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export interface Member {
  fullname: string;
  _id: string;
  photo: string;
}

export interface Donation {
  status: string;
  donationStatus: string;
  interval: string;
  active: boolean;
  createAt: string;
  _id: string;
  user: {
    _id: string;
    fullname: string;
    photo: string;
  };
  paymentIntentId: string;
  amount: number;
  event: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Event {
  _id: string;
  photo: string;
  name: string;
  description: string;
  fundraisingGoal: number;
  fundRaised: number;
  interests: string[];
  invitees: any[];
  organization: any;
  category: string;
  createdAt: string;
  endTime: string;
  loc: {
    type: string;
    coordinates: [number, number];
  };
  members: Member[];
  community: {
    _id: string;
    interests: string[];
    members: string[];
    invitees: string[];
    moderators: string[];
    name: string;
    description: string;
    admin: string;
    posts: {
      totalPosts: number;
    }[];
    totalMembers: number;
    totalPosts: number;
  };
  admin: {
    fullname: string;
    email: string;
    photo: string;
    _id: string;
  };
  goalReached: boolean;
  updatedAt: Date;
}

export const columns: ColumnDef<Event>[] = [
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
    header: () => <div className="text-start">Event Name</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("name") ? row.getValue("name") : "-"}
      </div>
    ),
  },

  {
    accessorKey: "members",
    header: () => <div className="text-start">Participants</div>,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="text-start">
          {row.getValue("members") ? event.members.length : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "organization",
    header: () => <div className="text-start">Organization</div>,
    cell: ({ row }) => {
      const event = row.original;

      return (
        <div className="text-start">
          {row.getValue("organization") ? event.organization?.name : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-start">Created on</div>,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="text-start">
          {row.getValue("updatedAt")
            ? formatReadableDate(event.updatedAt)
            : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const event = row.original;

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
                  to: "/dashboard/events/$id",
                  params: {
                    id: event._id,
                  },
                });
              }}
            >
              <Pencil size={18} />{" "}
              <span className="text-base">Manage Event</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const member_columns: ColumnDef<Member>[] = [
  {
    accessorKey: "SN",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-muted-foreground ">{Number(row.index) + 1}</div>
    ),
  },
  {
    accessorKey: "fullname",
    header: () => <div className="text-start">Member</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("fullname") ? row.getValue("fullname") : "-"}
      </div>
    ),
  },
  {
    accessorKey: "photo",
    header: () => <div className="text-start">Profile Image</div>,
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="text-start">
          {row.getValue("photo") ? (
            <img src={member.photo} className="w-5 h-5 rounded-full" alt="" />
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
];

export const donation_columns: ColumnDef<Donation>[] = [
  {
    accessorKey: "SN",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-muted-foreground ">{Number(row.index) + 1}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-start">Amount Donated</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("amount")
          ? `£ ${Number(row.getValue("amount")) / 100}`
          : "-"}
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: () => <div className="text-start">Donor</div>,
    cell: ({ row }) => {
      const user = row.original.user;

      return <div className="text-start">{user ? user.fullname : "-"}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">Date/time</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("createdAt")
          ? formatReadableDate(new Date(row.getValue("createdAt")))
          : "-"}
      </div>
    ),
  },
];

export const user_columns: ColumnDef<Event>[] = [
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
    accessorKey: "fundRaised",
    header: () => <div className="text-start">Amount Donated</div>,
    cell: ({ row }) => {
      const fundRaised: number = row.getValue("fundRaised");
      return (
        <div className="text-start">
          {row.getValue("fundRaised") ? `£ ${fundRaised / 100}` : "£ 0"}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="text-start">Event Name</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("name") ? row.getValue("name") : "-"}
      </div>
    ),
  },

  {
    accessorKey: "organization",
    header: () => <div className="text-start">Organization</div>,
    cell: ({ row }) => {
      const event = row.original;

      return (
        <div className="text-start">
          {row.getValue("organization") ? event.organization?.name : "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: () => <div className="text-start">Joined/Created on</div>,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="text-start ">
          {row.getValue("updatedAt")
            ? formatDate(String(event.updatedAt))
            : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-5" align="end">
            <DropdownMenuItem
              className="text-sm flex font-medium cursor-pointer space-x-3 bg-orange-500 text-white"
              onClick={() => {}}
            >
              <CalendarRange size={15} /> <span>Manage Event</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
