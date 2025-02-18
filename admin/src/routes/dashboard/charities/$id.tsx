import { PageTitle } from "@/components/layout/page-title";
import { useOrganizationDetails } from "@/hooks/fetch/organization";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  createFileRoute,
  Outlet,
  useParams,
  useRouterState,
  Link,
} from "@tanstack/react-router";
import { MoreVertical, Trash, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import placeholder from "@/assets/dashboard/placeholder.jpg";
import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";

export const Route = createFileRoute("/dashboard/charities/$id")({
  component: Layout,
});

function Layout() {
  const { id } = useParams({
    strict: false,
  });

  const { pathname } = useRouterState().location;

  const { data } = useOrganizationDetails({
    id: String(id),
  });

  const list = [
    {
      name: "Email",
      data: data?.email || "",
    },
    {
      name: "Organization ID",
      data: data?._id || "",
    },
    {
      name: "Longitude",
      data: data?.loc.coordinates[0] || "",
    },
    {
      name: "Latitude",
      data: data?.loc.coordinates[1] || "",
    },
    {
      name: "City",
      data: data?.city || "",
    },
    {
      name: "Country",
      data: data?.country || "",
    },
    {
      name: "Postal Code",
      data: data?.postalCode || "",
    },
  ];

  const link = [
    {
      title: "Donation history",
      path: `/dashboard/charities/${id}`,
    },
    {
      title: "Wallet",
      path: `/dashboard/charities/${id}/wallet`,
    },
    {
      title: "Events",
      path: `/dashboard/charities/${id}/event`,
    },
  ];

  return (
    <div className="space-y-8">
      {![`/dashboard/charities/${id}/edit`].includes(pathname) && (
        <Fragment>
          <div className="space-y-5">
            <PageTitle title="Charities" subTitle="View organization profile" />
            <div className="w-full bg-white p-5 rounded flex flex-col items-start lg:flex-row lg:space-x-10 space-y-5 lg:space-y-0 relative">
              <img
                src={data?.logo || placeholder}
                className="w-full lg:w-[300px] h-full lg:h-[400px] rounded object-cover"
                loading="eager"
              />

              <div className="flex flex-col space-y-5 w-full">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">
                    Organization details
                  </span>

                  <h3 className="text-2xl font-cairo font-bold">
                    {data?.name || "Charity"}
                  </h3>
                </div>

                <ul className="space-y-5 w-full font-cairo">
                  {list.map((item, index) => (
                    <li className="space-x-2 flex items-center" key={index}>
                      <span className="text-muted-foreground font-cairo lg:w-[120px]">
                        {item.name}:{" "}
                      </span>
                      <span>{item.data}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 absolute top-5 right-7"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="space-y-1">
                  <DropdownMenuItem
                    className="text-sm flex font-medium cursor-pointer space-x-3 bg-purple-600 text-white"
                    asChild
                  >
                    <Link
                      to="/dashboard/charities/$id/edit"
                      params={{ id: String(id) }}
                    >
                      <Wand2 size={15} /> <span>Edit Details</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-sm flex font-medium cursor-pointer space-x-3 bg-red-500 text-white"
                    asChild
                  >
                    <Link
                      to="/dashboard/charities/$id"
                      params={{ id: String(id) }}
                    >
                      <Trash size={15} /> <span>Delete Organization</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="bg-white w-full p-5 rounded">
              <div className="flex flex-col lg:flex-row items-start space-y-1 lg:space-y-0 lg:space-x-5 text-black/70 font-cairo">
                <span className="w-[270px] text-nowrap">About Charity</span>
                <p>{data?.description}</p>
              </div>
            </div>
          </div>
          <nav className="flex w-full bg-white rounded items-center shadow font-cairo">
            {link.map((link, index) => {
              return (
                <Link
                  to={link.path}
                  key={index}
                  className={cn(
                    "py-2 font-medium transition-all w-1/3 text-center hover:bg-black/10 rounded-t",
                    pathname === link.path &&
                      "text-violet-500 border-b-2 border-violet-500"
                  )}
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>
        </Fragment>
      )}

      <Outlet />
    </div>
  );
}
