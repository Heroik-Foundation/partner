import { ColumnDef } from "@tanstack/react-table";
import { EventPartner } from "../hooks/query";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/helpers/date-time";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVerifyPartnerMutation } from "../hooks/mutation";

export const columns: ColumnDef<EventPartner>[] = [
  {
    accessorKey: "SN",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{Number(row.index) + 1}</div>
    ),
  },
  {
    accessorKey: "name",
    header: () => <div className="text-start">User</div>,
    cell: ({ row }) => {
      const user = row.original;
      const name = user.name;
      const photo = user.logo;

      return (
        <div className="text-start ">
          {name && photo && (
            <div className="space-x-1 flex items-center">
              <img className="w-5 h-5 object-fill rounded-full" src={photo} />
              <span>{name}</span>
            </div>
          )}
          {(!name || !photo) && <Badge variant="destructive">Not found</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "telephone",
    header: () => <div className="text-start">Phone</div>,
    cell: ({ row }) => {
      const user = row.original;
      const phone = user.telephone;

      return (
        <div className="text-start ">
          {phone && phone}
          {!phone && <Badge variant="destructive">Not found</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: () => <div className="text-start">Email</div>,
    cell: ({ row }) => {
      const user = row.original;
      const email = user.email;

      return (
        <div className="text-start ">
          {email && email}
          {!email && <Badge variant="destructive">Not found</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="text-start">Address</div>,
    cell: ({ row }) => {
      const user = row.original;
      const address = user.address;

      return (
        <div className="text-start ">
          {address && address}
          {!address && <Badge variant="destructive">Not found</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div className="text-start">Joined</div>,
    cell: ({ row }) => {
      const user = row.original;
      const date = user.createdAt;

      return <div className="text-start ">{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "isVerified",
    header: () => <div className="text-start">Verified</div>,
    cell: ({ row }) => {
      const user = row.original;
      const verified = user.isVerified;

      const { mutate, isPending } = useVerifyPartnerMutation();

      return (
        <div className="text-start ">
          {verified && (
            <Badge variant={"success"} className="space-x-1">
              <span>Verified</span>
              <BadgeCheck size={12} />
            </Badge>
          )}
          {!verified && (
            <Button
              isLoading={isPending}
              size={"sm"}
              variant={"secondary"}
              className="h-6 text-sm"
              onClick={() => {
                mutate({
                  id: user._id,
                });
              }}
            >
              Verify
            </Button>
          )}
        </div>
      );
    },
  },
];
