import { Fragment } from "react/jsx-runtime";
import { useUserNotificationsQuery } from "../hooks/query";

import { useIntersectionObserver } from "@/hooks/observer";
import { truncateText } from "@/helpers/text";
import { getReadableTime } from "@/helpers/time";

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

export const NotificationsList = () => {
  const { data, isPending, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserNotificationsQuery();

  const rows = data?.pages || [];

  const lastNotificationRef = useIntersectionObserver<HTMLDivElement>(
    fetchNextPage,
    [hasNextPage]
  );

  return (
    <div className="w-full">
      {rows.map((notification, index, list) => {
        const { message, title, createdAt, type } = notification;
        const photo =
          type === "COMMUNITY_INVITE" ||
          type === "COMMUNITY_REPORT" ||
          type === "NEW_COMMENT" ||
          type === "NEW_LIKE" ||
          type === "NEW_POST" ||
          type === "POST_REPORT" ||
          type === "FOLLOW"
            ? chat
            : type === "NEW_PAYMENT" || type === "NEW_DONATION"
              ? pledge
              : calendar;
        return (
          <Drawer>
            <DrawerTrigger asChild>
              <div
                key={index}
                className="py-2.5 flex items-start justify-between w-full"
                ref={
                  list.length - 1 === index ? lastNotificationRef : undefined
                }
              >
                <div className="flex items-center space-x-1.5">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <img className="w-5 h-5" src={photo} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary">
                      {title}
                    </span>
                    <p className="text-xs font-bold text-primary/50">
                      {truncateText(message, 28)}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold text-primary/50">
                  {getReadableTime(createdAt)}
                </span>
              </div>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle className="font-extrabold text-lg text-primary">
                  {title}
                </DrawerTitle>
                <DrawerDescription className="text-primary/50 font-semibold">
                  {message}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <DrawerClose>
                  <Button className="w-full">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        );
      })}
      {(isPending || isFetchingNextPage) && (
        <Fragment>
          <NotificationItemSkeletonLoader />
          <NotificationItemSkeletonLoader />
        </Fragment>
      )}
    </div>
  );
};

const NotificationItemSkeletonLoader = () => {
  return (
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
};
