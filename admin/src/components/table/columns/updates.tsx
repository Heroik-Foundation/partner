"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import IOSGrey from "@/assets/platform/ios-grey.svg";
import androidGrey from "@/assets/platform/android-grey.svg";

import { formatReadableDate } from "@/helpers/date-time";
import { UnavailableMarker } from "./markers";
import { useCurrentPlatform } from "@/routes/dashboard/update-logs/index.lazy";
import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";

export interface AppVersion {
  features: string[];
  _id: string;
  currentVersion: string;
  minStableVersion: string;
  platform: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const columns: ColumnDef<AppVersion>[] = [
  {
    accessorKey: "SN",
    header: "SN",
    cell: ({ row }) => (
      <div className="text-muted-foreground">{Number(row.index) + 1}</div>
    ),
  },
  {
    accessorKey: "currentVersion",
    header: "Version name",
    cell: ({ row }) => {
      const { platform } = useCurrentPlatform();

      return (
        <div className="capitalize">
          {row.getValue("currentVersion") ? (
            <div className="flex flex-row items-center space-x-2.5">
              <img
                src={platform === "ios" ? IOSGrey : androidGrey}
                className={cn(platform === "ios" && "mb-0.5")}
              />
              <span>Version {row.getValue("currentVersion")}</span>
            </div>
          ) : (
            <UnavailableMarker />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "features",
    header: "Items",
    cell: ({ row }) => {
      const version = row.original;
      return (
        <div className="capitalize">
          {version.features ? version.features.length : <UnavailableMarker />}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date/time",
    cell: ({ row }) => {
      const version = row.original;
      return (
        <div className="capitalize">
          {version.createdAt ? (
            formatReadableDate(new Date(version.createdAt))
          ) : (
            <UnavailableMarker />
          )}
        </div>
      );
    },
  },
  {
    header: "View",
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const version = row.original;
      const id = version._id;

      const { navigate } = useRouter();

      return (
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={() => {
            navigate({
              to: "/dashboard/update-logs/$id",
              params: {
                id: id,
              },
            });
          }}
        >
          <Folder className="h-4 w-4" />
        </Button>
      );
    },
  },
];
