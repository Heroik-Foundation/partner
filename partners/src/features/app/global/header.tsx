import { PreviousButton } from "@/modules/units/page/button";
import type { Variants } from "@/modules/units/page/button";
import { UserRound } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useConversationsQuery, useUserPropertiesQuery } from "./hooks/query";
import { useUserNotificationsQuery } from "../notifications/hooks/query";

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
        <div className="space-y-0.5">
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

  const profileImage = user && user.logo ? user.logo : undefined;

  const unreadMessages =
    messages?.pages
      .flat()
      .filter((message) => message.lastMessage.status === "unread").length || 0;

  return (
    <header className="w-full flex justify-between items-center py-2">
      <Link
        to="/app/profile"
        className="p-2.5 border-b bg-primary/10 rounded-xl"
      >
        {profileImage ? (
          <img
            src={profileImage}
            alt="Partner Profile Image"
            className="rounded-full w-6 h-6 object-fill"
          />
        ) : (
          <UserRound className="fill-primary stroke-primary/10" />
        )}
      </Link>

      <div className="flex items-center">
        <Link className="relative" to="/app/messages">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 8C17.79 8 16 6.21 16 4C16 1.79 17.79 0 20 0C22.21 0 24 1.79 24 4C24 6.21 22.21 8 20 8ZM12 15.42C12.77 15.42 13.54 15.13 14.12 14.54L18.79 9.87C16.06 9.31 14 6.89 14 3.99C14 3.65 14.04 3.32 14.09 2.99H5C3.19 2.99 1.62 3.96 0.74 5.4L9.88 14.55C10.46 15.13 11.23 15.43 12 15.43V15.42ZM21.76 9.73L15.53 15.96C14.56 16.93 13.27 17.42 11.99 17.42C10.71 17.42 9.43 16.93 8.45 15.96L0.05 7.54C0.04 7.69 0 7.84 0 8V19C0 21.76 2.24 24 5 24H19C21.76 24 24 21.76 24 19L23.98 8.47C23.34 9.04 22.59 9.47 21.76 9.73Z"
              fill="#37137F"
            />
          </svg>

          {unreadMessages >= 1 && (
            <span className="absolute h-4 w-4 bg-accent rounded-full text-xs font-semibold -top-1.5 -right-1.5 flex text-center items-center justify-center text-white">
              {unreadMessages}
            </span>
          )}
        </Link>

        <Link to="/app/settings" className="rounded-xl text-primary p-2.5 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="28"
            viewBox="0 0 30 32"
            fill="none"
          >
            <path
              d="M1.14292 24C2.24579 25.9141 4.6916 26.5718 6.60573 25.4689C6.60704 25.4681 6.60829 25.4674 6.6096 25.4666L7.20292 25.1239C8.32292 26.0822 9.61029 26.8253 11.0002 27.3159V28C11.0002 30.2091 12.7911 32 15.0002 32C17.2094 32 19.0002 30.2091 19.0002 28V27.316C20.3904 26.8246 21.6778 26.0806 22.7975 25.1213L23.3935 25.4653C25.3081 26.5699 27.7557 25.9132 28.8602 23.9986C29.9648 22.0841 29.3082 19.6365 27.3935 18.5319L26.8015 18.1906C27.068 16.7406 27.068 15.2541 26.8015 13.8039L27.3935 13.4626C29.3081 12.3581 29.9648 9.91056 28.8602 7.99594C27.7557 6.08138 25.3082 5.42469 23.3935 6.52925L22.8002 6.87194C21.6791 5.91488 20.3909 5.17313 19.0002 4.684V4C19.0002 1.79087 17.2094 0 15.0002 0C12.7911 0 11.0002 1.79087 11.0002 4V4.684C9.6101 5.17544 8.32267 5.91944 7.20292 6.87869L6.60692 6.53337C4.69229 5.42875 2.24479 6.08544 1.14023 8C0.0356656 9.91456 0.692291 12.3621 2.60692 13.4667L3.19892 13.808C2.93242 15.2581 2.93242 16.7446 3.19892 18.1947L2.60692 18.536C0.697603 19.6435 0.0431031 22.0863 1.14292 24ZM15.0002 10.6667C17.9457 10.6667 20.3335 13.0545 20.3335 16C20.3335 18.9455 17.9457 21.3333 15.0002 21.3333C12.0547 21.3333 9.66692 18.9455 9.66692 16C9.66692 13.0545 12.0547 10.6667 15.0002 10.6667Z"
              fill="#37137F"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
