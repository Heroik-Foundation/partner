import { Button } from "@/modules/ui/button";
import { useChannelAnnouncementsQuery } from "../hooks/query";
import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import { Post } from "@/features/app/global/types";
import { UserPost, UserPostLoader } from "./post";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ChannelRequest } from "./request";

interface Props {
  id: string;
}

type Tab = "announcements" | "requests";

export function ChannelDetailTabs({ id }: Props) {
  const [tab, setTab] = useState<Tab>("announcements");

  const tabs = [
    {
      name: "announcements",
      value: 0,
      component: PostTab,
    },
    {
      name: "requests",
      value: 0,
      component: RequestTab,
    },
  ];

  const CurrentTab = (tabs.find((item) => item.name === tab) || tabs[0])
    .component;

  return (
    <div className="space-y-6">
      <div className="w-full flex items-center justify-between sm:justify-around space-x-5">
        {tabs.map((item, index) => {
          const isActive = item.name === tab;
          return (
            <Button
              size={"lg"}
              className={cn(
                "rounded-full w-fit py-6 px-6 first-letter:uppercase",
                !isActive && "bg-primary/10 text-primary",
                "transition-all"
              )}
              key={index}
              onClick={() => {
                setTab(item.name as Tab);
              }}
            >
              <p className="first-letter:uppercase">{item.name}</p>
              <div
                className={cn(
                  "bg-accent h-5 w-5 rounded-full text-[10px] font-extrabold flex items-center justify-center",
                  !isActive && "text-white"
                )}
              >
                <span className="h-[18px] w-fit">{item.value}</span>
              </div>
            </Button>
          );
        })}
      </div>

      <CurrentTab id={id} />
    </div>
  );
}

function PostTab({ id }: Props) {
  const { data: user } = useUserPropertiesQuery();
  const { data: announcements } = useChannelAnnouncementsQuery({ id });

  const filteredPosts = announcements?.pages || [];

  return (
    <div>
      <div className="space-y-10">
        {filteredPosts &&
          filteredPosts.map((post: Post) => (
            <UserPost
              userId={user?._id}
              {...post}
              channelId={id}
              key={post._id}
            />
          ))}
      </div>
      {!filteredPosts && (
        <>
          <UserPostLoader /> <UserPostLoader />
        </>
      )}
    </div>
  );
}

function RequestTab({}: Props) {
  return (
    <div className="">
      <ChannelRequest username={"John Doe"} />
      <ChannelRequest username={"Mary Jane"} />
    </div>
  );
}
