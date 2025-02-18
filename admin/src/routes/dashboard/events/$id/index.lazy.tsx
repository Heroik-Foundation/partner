import { PageTitle } from "@/components/layout/page-title";
import { DatePicker } from "@/components/table/date-picker";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import donationBadge from "@/assets/events/event/donation.svg";
import donorsBadge from "@/assets/events/event/donors.svg";
import nonDonorsBadge from "@/assets/events/event/non-donors.svg";
import participationBadge from "@/assets/events/event/participation.svg";
import usersBadge from "@/assets/communities/badges/users.svg";
import { useEventById, useEventDonations } from "@/hooks/fetch/event";
import { formatDate } from "@/helpers/date-time";
import { MoreVertical, Trash } from "lucide-react";
import { useEventDeleteMutation } from "@/hooks/mutation/event";
import { LoadingSpinner } from "@/components/ui/loading";
import { TableBase } from "@/components/table";
import { donation_columns } from "@/components/table/columns/event";

export const Route = createLazyFileRoute("/dashboard/events/$id/")({
  component: Page,
});

function Page() {
  const { id } = useParams({
    strict: false,
  });

  const { data, isFetching } = useEventById({
    id: String(id),
  });

  const { mutate, isPending } = useEventDeleteMutation({
    id: String(id),
  });

  const {
    data: donations,
    hasNextPage,
    fetchNextPage,
    isFetching: isFetchingDonations,
  } = useEventDonations({
    id: String(id),
  });
  const row = donations?.pages ? donations.pages.flat() : [];

  const cards = [
    {
      title: "Total event donations",
      data: Number(data?.fundRaised) / 100 || 0,
      badge: donationBadge,
    },
    {
      title: "Non donors",
      data: data?.invitees.length || 0,
      badge: nonDonorsBadge,
    },
    {
      title: "Event Donors",
      data: 0,
      badge: donorsBadge,
    },
    {
      title: "Total participation",
      data: 0,
      badge: participationBadge,
    },
    {
      title: "Total Members",
      data: data?.members.length || 0,
      badge: usersBadge,
    },
  ];

  const details = [
    {
      title: "Created by",
      data: data?.admin.fullname || "",
    },
    {
      title: "Organization",
      data: data?.organization.name || "s",
    },
    {
      title: "Created at",
      data: formatDate(String(data?.createdAt)) || "",
    },
    {
      title: "End time",
      data: formatDate(String(data?.endTime)) || "",
    },
  ];

  return (
    <div className="space-y-8">
      <PageTitle title="Events" subTitle="View all events" />
      <DatePicker />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((item, index) => (
          <div
            key={index}
            className="w-full lg:w-[260px] h-[100px] bg-white shadow rounded-xl p-4 relative mx-auto lg:mx-0"
          >
            <div className="font-cairo flex flex-col h-full justify-between">
              <span className="text-muted-foreground">{item.title}</span>
              <h3 className="text-3xl font-semibold">
                {" "}
                {["Total event donations"].includes(item.title) && "£"}{" "}
                {item.data.toLocaleString()}
              </h3>
            </div>
            <img
              className="absolute right-4 top-4"
              src={item.badge}
              alt="Badge icon"
            />
          </div>
        ))}
      </div>

      <div className="bg-white shadow border rounded-3xl ">
        <div className="w-full p-5 flex items-start justify-between">
          <div className="flex flex-col items-start space-y-2  max-w-xl">
            <h1 className="text-2xl font-bold font-cairo">
              {data?.description.slice(0, 40)}...
            </h1>
            <ul className="space-y-2">
              {details.map((detail, index) => (
                <li
                  className="flex font-cairo text-muted-foreground space-x-2"
                  key={index}
                >
                  <span>{detail.title}: </span>
                  <span className="font-medium">
                    {isFetching ? "-" : detail.data}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-sm flex font-medium cursor-pointer space-x-3 bg-red-500 text-white"
                onClick={() => {
                  mutate();
                }}
              >
                {isPending ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <Trash size={15} /> <span>Delete Event</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TableBase
          data={row}
          columns={donation_columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetchingDonations,
          }}
        />
      </div>
    </div>
  );
}
