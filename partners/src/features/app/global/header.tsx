import { PreviousButton } from "@/modules/units/page/button";
import type { Variants } from "@/modules/units/page/button";
import { UserCircle2Icon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useConversationsQuery, useUserPropertiesQuery } from "./hooks/query";
import { useUserNotificationsQuery } from "../notifications/hooks/query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/ui/popover";
import { textLimit } from "@/lib/textlimit";
import { usePermissions } from "@/hooks/use-permissions";
import { RoleBadge } from "@/modules/units/badge/role-badge";

type HeaderProps = {
  header: {
    title: string;
    subtitle?: string;
    position: "inline" | "stacked";
  };
  addOns?: {
    notification?: boolean;
    content?: React.ReactNode;
  };
  previousButtonVariant?: Variants;
  previousButtonRoute?: string;
  previousRouteCallback?: () => void;
};

export const Header = (props: HeaderProps) => {
  const { title, position, subtitle } = props.header;
  const {
    previousButtonVariant = "default",
    addOns,
    previousButtonRoute,
    previousRouteCallback,
  } = props;
  const { data: notifications } = useUserNotificationsQuery();

  const unSeenNotifications =
    notifications?.pages
      .flat()
      .filter((notification) => notification.isRead === false).length || 0;

  return (
    <header>
      <div className="flex justify-between items-center py-2 relative z-10 px-1">
        <PreviousButton
          variant={previousButtonVariant}
          route={previousButtonRoute}
          callback={previousRouteCallback}
        />
        {position === "inline" && (
          <div className="font-black text-primary text-base font-axiforma absolute inset-0 flex items-center justify-center">
            <span>{title}</span>
          </div>
        )}

        {addOns?.notification ? (
          <Link to="/app/notifications" className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <g clipPath="url(#clip0_1781_6443)">
                <path
                  d="M7.42383 21.5C7.81149 22.3914 8.45106 23.1502 9.26398 23.6831C10.0769 24.216 11.0278 24.4999 11.9998 24.4999C12.9719 24.4999 13.9228 24.216 14.7357 23.6831C15.5486 23.1502 16.1882 22.3914 16.5758 21.5H7.42383Z"
                  fill="#37137F"
                />
                <path
                  d="M22.3918 13.049L20.6558 7.32602C20.0999 5.32437 18.8912 3.5658 17.2217 2.32952C15.5522 1.09325 13.5175 0.450139 11.4407 0.502299C9.36396 0.55446 7.36413 1.2989 5.75878 2.61743C4.15342 3.93595 3.03455 5.75298 2.57981 7.78002L1.23181 13.317C1.05264 14.0528 1.04293 14.8196 1.20342 15.5597C1.3639 16.2997 1.69039 16.9937 2.15823 17.5891C2.62607 18.1845 3.22306 18.666 3.90412 18.997C4.58519 19.328 5.33255 19.5 6.08981 19.5H17.6068C18.3875 19.5 19.1574 19.3172 19.8548 18.9663C20.5522 18.6153 21.1577 18.1058 21.6228 17.4788C22.088 16.8517 22.3998 16.1244 22.5333 15.3552C22.6668 14.586 22.6184 13.7962 22.3918 13.049Z"
                  fill="#37137F"
                />
              </g>
              <defs>
                <clipPath id="clip0_1781_6443">
                  <rect
                    width="24"
                    height="24"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>
            {unSeenNotifications >= 1 && (
              <div className="absolute bg-accent text-white w-5 h-5 rounded-full text-xs font-extrabold font-axiforma justify-center items-center flex -top-1.5 -right-1.5">
                {unSeenNotifications}
              </div>
            )}
          </Link>
        ) : (
          <div />
        )}

        {addOns?.content}
      </div>
      {position === "stacked" && (
        <div className="space-y-0.5 pl-1">
          <h1 className="font-black text-primary text-2xl font-axiforma">
            {title}
          </h1>

          {subtitle && (
            <p className="text-sm font-semibold text-primary/50">{subtitle}</p>
          )}
        </div>
      )}
    </header>
  );
};

export function HomeHeader() {
  const { data: user } = useUserPropertiesQuery();
  const { data: messages } = useConversationsQuery({});
  const { data: notifications } = useUserNotificationsQuery();
  const { displayName, roleTag, membership } = usePermissions();

  const unSeenNotifications =
    notifications?.pages
      .flat()
      .filter((notification) => notification.isRead === false).length || 0;

  const unreadMessages =
    messages?.pages
      .flat()
      .filter((message) => message.lastMessage.status === "unread").length || 0;

  const profileImage =
    membership?.user?.photo || (user && user.logo ? user.logo : undefined);

  return (
    <header className="w-full flex justify-between items-center py-2 gap-3">
      <div className="lg:max-w-[500px] max-w-[320px] flex items-center space-x-2.5">
        <div className="flex flex-col min-w-0">
          <span className="text-xs md:text-sm font-bold text-primary/70 font-axiforma">
            Welcome
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-left text-sm md:text-base font-black text-primary font-axiforma truncate cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                  title={displayName}
                >
                  {textLimit(displayName, 24) || "Partner"},
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={6}
                className="w-auto max-w-[280px] sm:max-w-sm p-3 bg-white shadow-lg border border-primary/15 rounded-xl text-primary font-axiforma space-y-2"
              >
                <div className="flex items-center justify-between gap-2 border-b border-primary/10 pb-2">
                  <p className="text-sm font-bold text-primary break-words">
                    {displayName}
                  </p>
                  <RoleBadge role={roleTag} size="sm" />
                </div>
                {membership?.user?.email && (
                  <p className="text-xs text-primary/70 break-all">
                    {membership.user.email}
                  </p>
                )}
                {user?.name && user.name !== displayName && (
                  <p className="text-xs text-primary/50">
                    Organization: <span className="font-semibold text-primary">{user.name}</span>
                  </p>
                )}
              </PopoverContent>
            </Popover>
            <RoleBadge role={roleTag} size="sm" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-3.5 flex-shrink-0">
        <Link to="/app/notifications" className="relative p-1 sm:p-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="21"
            viewBox="0 0 24 25"
            fill="none"
            className="sm:w-[22px] sm:h-[23px] md:w-[24px] md:h-[25px]"
          >
            <g clipPath="url(#clip0_1781_6443)">
              <path
                d="M7.42383 21.5C7.81149 22.3914 8.45106 23.1502 9.26398 23.6831C10.0769 24.216 11.0278 24.4999 11.9998 24.4999C12.9719 24.4999 13.9228 24.216 14.7357 23.6831C15.5486 23.1502 16.1882 22.3914 16.5758 21.5H7.42383Z"
                fill="#37137F"
              />
              <path
                d="M22.3918 13.049L20.6558 7.32602C20.0999 5.32437 18.8912 3.5658 17.2217 2.32952C15.5522 1.09325 13.5175 0.450139 11.4407 0.502299C9.36396 0.55446 7.36413 1.2989 5.75878 2.61743C4.15342 3.93595 3.03455 5.75298 2.57981 7.78002L1.23181 13.317C1.05264 14.0528 1.04293 14.8196 1.20342 15.5597C1.3639 16.2997 1.69039 16.9937 2.15823 17.5891C2.62607 18.1845 3.22306 18.666 3.90412 18.997C4.58519 19.328 5.33255 19.5 6.08981 19.5H17.6068C18.3875 19.5 19.1574 19.3172 19.8548 18.9663C20.5522 18.6153 21.1577 18.1058 21.6228 17.4788C22.088 16.8517 22.3998 16.1244 22.5333 15.3552C22.6668 14.586 22.6184 13.7962 22.3918 13.049Z"
                fill="#37137F"
              />
            </g>
            <defs>
              <clipPath id="clip0_1781_6443">
                <rect
                  width="24"
                  height="24"
                  fill="white"
                  transform="translate(0 0.5)"
                />
              </clipPath>
            </defs>
          </svg>
          {unSeenNotifications >= 1 && (
            <div className="absolute bg-accent text-white w-4 h-4 sm:w-5 sm:h-5 rounded-full text-[10px] sm:text-xs font-extrabold font-axiforma justify-center items-center flex -top-1 -right-1 sm:-top-1.5 sm:-right-1.5">
              {unSeenNotifications > 9 ? "9+" : unSeenNotifications}
            </div>
          )}
        </Link>

        <Link to="/app/messages" className="relative p-1 sm:p-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="sm:w-[22px] sm:h-[22px] md:w-[24px] md:h-[24px]"
          >
            <path
              d="M20 8C17.79 8 16 6.21 16 4C16 1.79 17.79 0 20 0C22.21 0 24 1.79 24 4C24 6.21 22.21 8 20 8ZM12 15.42C12.77 15.42 13.54 15.13 14.12 14.54L18.79 9.87C16.06 9.31 14 6.89 14 3.99C14 3.65 14.04 3.32 14.09 2.99H5C3.19 2.99 1.62 3.96 0.74 5.4L9.88 14.55C10.46 15.13 11.23 15.43 12 15.43V15.42ZM21.76 9.73L15.53 15.96C14.56 16.93 13.27 17.42 11.99 17.42C10.71 17.42 9.43 16.93 8.45 15.96L0.05 7.54C0.04 7.69 0 7.84 0 8V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19L23.98 8.47C23.34 9.04 22.59 9.47 21.76 9.73Z"
              fill="#37137F"
            />
          </svg>

          {unreadMessages >= 1 && (
            <span className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4 bg-accent rounded-full text-[10px] sm:text-xs font-semibold -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex text-center items-center justify-center text-white">
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </span>
          )}
        </Link>

        <Link
          to="/app/profile/manage"
          className="rounded-xl relative size-7 sm:size-8 md:size-9 flex-shrink-0"
        >
          {profileImage ? (
            <img
              src={profileImage}
              alt="Partner Profile Image"
              className="rounded-full object-cover h-full w-full"
            />
          ) : (
            <UserCircle2Icon className="fill-primary stroke-primary/10 w-full h-full" />
          )}

          <div className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-emerald-400 rounded-full bottom-0 animate-pulse z-10 right-0 border-white border" />
        </Link>
      </div>
    </header>
  );
}
