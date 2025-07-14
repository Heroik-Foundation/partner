import { cn } from "@/lib/utils";
import { Icon, IconNames } from "./icon";
import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { deleteSessionToken } from "@/helpers/session";
import { toast } from "sonner";

export type Path =
  | "/dashboard/charities"
  | "/dashboard/communities"
  | "/dashboard/contacts"
  | "/dashboard/donations"
  | "/dashboard/events"
  | "/dashboard/manage"
  | "/dashboard/reports"
  | "/dashboard/update-logs"
  | "/dashboard/categories"
  | "/dashboard/partners"
  | "/dashboard/users"
  | "/dashboard"
  | "/";

interface Links {
  name: string;
  path: Path;
  svg: IconNames;
  callback?: () => void;
}

export const links: Links[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    svg: "dashboard",
  },
  {
    name: "Users",
    path: "/dashboard/users",
    svg: "users",
  },
  {
    name: "Charities",
    path: "/dashboard/charities",
    svg: "charities",
  },
  {
    name: "Donations",
    path: "/dashboard/donations",
    svg: "donations",
  },
  {
    name: "Events",
    path: "/dashboard/events",
    svg: "events",
  },
  {
    name: "Communities",
    path: "/dashboard/communities",
    svg: "community",
  },
  {
    name: "Contacts",
    path: "/dashboard/contacts",
    svg: "contact",
  },
  {
    name: "Update logs",
    path: "/dashboard/update-logs",
    svg: "logs",
  },
  // {
  //   name: "Manage admin",
  //   path: "/dashboard/manage",
  //   svg: "users",
  // },
  // {
  //   name: "Reports",
  //   path: "/dashboard/reports",
  //   svg: "reports",
  // },
  {
    name: "Partners",
    path: "/dashboard/partners",
    svg: "partner",
  },
  {
    name: "Categories",
    path: "/dashboard/categories",
    svg: "categories",
  },
  {
    name: "Logout",
    path: "/",
    svg: "logout",
    callback: () => {},
  },
];

export function Sidebar() {
  return (
    <div className="hidden lg:block fixed left-0 top-0 bottom-0 h-[100vh] w-[250px] bg-transparent py-5 space-y-10">
      <div className="flex items-center space-x-2 px-5">
        <img
          src="/logo.png"
          alt="hiroek logo"
          className="w-10 h-10 bg-white rounded-xl p-1"
        />
        <span className="font-cairo text-xl font-bold">Hiroek</span>
      </div>
      <nav className="space-y-5 w-full font-cairo">
        {links.map((link, index) => (
          <LinkorButton {...link} key={index} />
        ))}
      </nav>
    </div>
  );
}

export function LinkorButton({ ...props }: Links) {
  const { location } = useRouterState();
  const { navigate } = useRouter();
  const pathname = location.pathname;

  if (props.callback) {
    return (
      <button
        className="flex items-center space-x-2 px-4 py-3"
        onClick={() => {
          toast.info("You're currently logged out");
          deleteSessionToken();
          navigate({
            to: props.path,
          });
        }}
      >
        <div className="w-5 flex items-center justify-center">
          <Icon
            title={props.svg}
            className={cn("stroke-black/50 fill-[#999999]")}
          />
        </div>
        <span>{props.name}</span>
      </button>
    );
  } else {
    return (
      <Link
        to={props.path}
        className={cn(
          "flex items-center space-x-2 px-4 py-1.5 border-l-4 transition-all",
          pathname === props.path
            ? "border-[#CB3CFF] font-bold text-[#4A16CD]"
            : "border-transparent"
        )}
      >
        <div className="w-5 flex items-center justify-center">
          <Icon
            className={cn(
              pathname === props.path
                ? "stroke-[#4A16CD] fill-[#4A16CD]/10"
                : "stroke-black/50 fill-[#999999]"
            )}
            title={props.svg}
          />
        </div>

        <span>{props.name}</span>
      </Link>
    );
  }
}
