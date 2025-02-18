import { formatReadableDate } from "@/helpers/date-time";
import { useUserDetails } from "@/hooks/fetch/users";
import {
  createFileRoute,
  useParams,
  useRouterState,
} from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";
import { PageTitle } from "@/components/layout/page-title";
import { Link } from "@tanstack/react-router";
import placeholder from "@/assets/dashboard/placeholder.jpg";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/users/$id")({
  component: Layout,
});

function Layout() {
  const { pathname } = useRouterState().location;
  const { id } = useParams({
    strict: false,
  });

  const { data } = useUserDetails({
    id: String(id),
  });

  const list = [
    {
      name: "Phone",
      data: (data && `(+${data?.callingCode})${data?.phone}`) || "",
    },
    {
      name: "Email",
      data: data?.email || "",
    },
    {
      name: "User ID",
      data: data?._id || "",
    },
    {
      name: "Joined",
      data: data?.createdAt ? formatReadableDate(data.createdAt) : "",
    },
  ];

  const link = [
    {
      title: "Donation history",
      path: `/dashboard/users/${id}`,
    },
    {
      title: "Events",
      path: `/dashboard/users/${id}/event`,
    },
    {
      title: "Communities",
      path: `/dashboard/users/${id}/community`,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <PageTitle title="Users" subTitle="View all users" />
        <div className="w-full bg-white p-5 rounded lg:h-[364px] shadow flex flex-col items-start lg:flex-row lg:space-x-10 space-y-5 lg:space-y-0">
          <img
            src={placeholder}
            className="w-full lg:w-[300px] h-full rounded object-cover"
            loading="eager"
          />

          <div className="flex flex-col space-y-5">
            <div className="flex flex-col space-y-1">
              <span className="text-xs text-muted-foreground">
                Personal details
              </span>

              <h3 className="text-2xl font-cairo font-bold">
                {data?.fullname || data?.username || "User"}
              </h3>
            </div>

            <ul className="space-y-5">
              {list.map((item, index) => (
                <li className="space-x-2 flex items-center" key={index}>
                  <span className="text-muted-foreground w-[70px]">
                    {item.name}:{" "}
                  </span>
                  <span>{item.data}</span>
                </li>
              ))}
            </ul>
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
      <Outlet />
    </div>
  );
}
