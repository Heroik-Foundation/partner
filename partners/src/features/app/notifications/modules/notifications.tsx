import { Fragment } from "react/jsx-runtime";
import { useUserNotificationsQuery } from "../hooks/query";
import { useIntersectionObserver } from "@/hooks/observer";
import { useWebSocket } from "@/hooks/web-socket";
import { truncateText } from "@/helpers/text";
import { getReadableTime } from "@/helpers/time";
import { Notification } from "@/features/app/global/types";

import chat from "../assets/chat.svg";
import pledge from "../assets/pledge.svg";
import calendar from "../assets/calendar.svg";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/modules/ui/drawer";
import { Button } from "@/modules/ui/button";
import { useEffect } from "react";

const getNotificationIcon = (type: Notification["type"]): string => {
  const communityTypes = [
    "COMMUNITY_INVITE",
    "COMMUNITY_REPORT",
    "NEW_COMMENT",
    "NEW_LIKE",
    "NEW_POST",
    "POST_REPORT",
    "FOLLOW",
    "NEW_CHAT",
  ] as const;

  const paymentTypes = ["NEW_PAYMENT", "NEW_DONATION"] as const;

  const eventTypes = ["EVENT_INVITE", "EVENT_UPDATE", "EVENT_STARTED"] as const;

  if (communityTypes.includes(type as any)) return chat;
  if (paymentTypes.includes(type as any)) return pledge;
  if (eventTypes.includes(type as any)) return calendar;
  return calendar; // default fallback
};

// UI Components
const NotificationIcon = ({ type }: { type: Notification["type"] }) => (
  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
    <img
      className="w-5 h-5"
      src={getNotificationIcon(type)}
      alt="notification"
    />
  </div>
);

const NotificationContent = ({
  notification,
}: {
  notification: Notification;
}) => (
  <div>
    <span className="text-xs font-bold text-primary">{notification.title}</span>
    <p className="text-xs font-bold text-primary/50">
      {truncateText(notification.message, 28)}
    </p>
  </div>
);

const NotificationTime = ({ createdAt }: { createdAt: string }) => (
  <span className="text-[10px] font-extrabold text-primary/50">
    {getReadableTime(createdAt)}
  </span>
);

const NotificationDrawerContent = ({
  notification,
}: {
  notification: Notification;
}) => (
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle className="font-extrabold text-lg text-primary">
        {notification.title}
      </DrawerTitle>
      <DrawerDescription className="text-primary/50 font-semibold">
        {notification.message}
      </DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <DrawerClose>
        <Button className="w-full">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
);

const NotificationItem = ({
  notification,
  isLast,
  onMarkAsRead,
  lastNotificationRef,
}: {
  notification: Notification;
  isLast: boolean;
  onMarkAsRead: (id: string) => void;
  lastNotificationRef?: (node: HTMLDivElement) => void;
}) => {
  useEffect(() => {
    onMarkAsRead(notification._id);
  }, []);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div
          className="py-2.5 flex items-start justify-between w-full"
          ref={isLast ? lastNotificationRef : undefined}
        >
          <div className="flex items-center space-x-1.5">
            <NotificationIcon type={notification.type} />
            <NotificationContent notification={notification} />
          </div>
          <NotificationTime createdAt={notification.createdAt} />
        </div>
      </DrawerTrigger>
      <NotificationDrawerContent notification={notification} />
    </Drawer>
  );
};

const NotificationItemSkeletonLoader = () => (
  <div className="py-2.5 flex items-start justify-between w-full animate-pulse">
    <div className="flex items-center space-x-1.5">
      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
        <div className="w-5 h-5 bg-primary/20 rounded" />
      </div>
      <div className="space-y-1">
        <div className="h-3 w-24 bg-primary/20 rounded" />
        <div className="h-2.5 w-32 bg-primary/10 rounded" />
      </div>
    </div>
    <div className="h-2.5 w-12 bg-primary/10 rounded mt-1.5" />
  </div>
);

const LoadingState = () => (
  <Fragment>
    <NotificationItemSkeletonLoader />
    <NotificationItemSkeletonLoader />
  </Fragment>
);

// Main Container Component
export const NotificationsList = () => {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserNotificationsQuery();

  const { markNotificationsAsRead } = useWebSocket();

  const notifications = data?.pages || [];

  const lastNotificationRef = useIntersectionObserver<HTMLDivElement>(
    fetchNextPage,
    [hasNextPage]
  );

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationsAsRead(notificationId);
  };

  return (
    <div className="w-full">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification._id || index}
          notification={notification}
          isLast={index === notifications.length - 1}
          onMarkAsRead={handleMarkAsRead}
          lastNotificationRef={lastNotificationRef}
        />
      ))}
      {(isPending || isFetchingNextPage) && <LoadingState />}
    </div>
  );
};
