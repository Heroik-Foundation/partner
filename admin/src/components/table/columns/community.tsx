import { Badge } from "@/components/ui/badge";
import { formatDate, formatReadableDate } from "@/helpers/date-time";
import { ColumnDef } from "@tanstack/react-table";

export interface Community {
  _id: string;
  interests: string[];
  members: string[];
  invitees: string[];
  moderators: string[];
  name: string;
  description: string;
  admin: {
    _id: string;
    fullname: string;
    photo: string;
  };
  posts: {
    totalPosts: number;
  }[];
  totalMembers: number;
  totalPosts: number;
}

export const columns: ColumnDef<Community>[] = [
  {
    accessorKey: "SN",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{Number(row.index) + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-start">Community Name</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("name") ? (
          row.getValue("name")
        ) : (
          <Badge variant={"destructive"}>Not found</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "posts",
    header: () => <div>Total posts</div>,
    cell: () => {
      return (
        <div className="text-center">
          <Badge variant={"destructive"}>Not found</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "members",
    header: () => <div className="text-center">Members</div>,
    cell: ({ row }) => {
      const community = row.original;

      const totalMembers = community.members.length;

      return (
        <div className="text-center">
          {row.getValue("members") ? totalMembers : "0"}
        </div>
      );
    },
  },
  {
    accessorKey: "admin",
    header: () => <div className="text-start">Creator</div>,
    cell: ({ row }) => {
      const community = row.original;

      const admin = community.admin.fullname || undefined;

      return (
        <div className="text-start">
          {admin ? admin : <Badge variant={"destructive"}>Not found</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">Created on</div>,
    cell: ({ row }) => (
      <div className="text-start">
        {row.getValue("createdAt") ? (
          formatReadableDate(row.getValue("createdAt"))
        ) : (
          <Badge variant={"destructive"}>Not found</Badge>
        )}
      </div>
    ),
  },
];

export const user_columns: ColumnDef<Community>[] = [
  {
    accessorKey: "SN",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{Number(row.index) + 1}</div>
    ),
  },
  {
    accessorKey: "posts",
    header: () => <div>Total posts</div>,
    cell: () => {
      return (
        <div className="text-center">
          <Badge variant={"destructive"}>Not found</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: () => <div className="text-start">Community Name</div>,
    cell: ({ row }) => (
      <div className="text-start ">
        {row.getValue("name") ? (
          row.getValue("name")
        ) : (
          <Badge variant={"destructive"}>Not found</Badge>
        )}
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">Joined/Created on</div>,
    cell: ({ row }) => (
      <div className="text-start ">
        {row.getValue("createdAt") ? (
          formatDate(row.getValue("createdAt"))
        ) : (
          <Badge variant={"destructive"}>Not found</Badge>
        )}
      </div>
    ),
  },
];
