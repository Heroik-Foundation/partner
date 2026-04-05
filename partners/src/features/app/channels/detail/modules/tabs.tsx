import { Button } from "@/modules/ui/button";
import { useChannelAnnouncementsQuery } from "../hooks/query";
import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import { Post } from "@/features/app/global/types";
import { UserPost, UserPostSkeleton } from "./post";
import { cn } from "@/lib/utils";
import { Fragment, useState } from "react";

interface Props {
  id: string;
  isPublic: boolean;
}

type Tab = "announcements" | "requests";

type TabConfig = {
  name: Tab;
  value: number;
  component: React.ComponentType<Props>;
};

export function ChannelDetailTabs({ id, isPublic }: Props) {
  const [tab, setTab] = useState<Tab>("announcements");

  // Data
  const { data: announcements } = useChannelAnnouncementsQuery({ id });
  const announcementsCount =
    ((announcements?.pages as any[]) || []).flat().length || 0;

  const tabs: TabConfig[] = [
    {
      name: "announcements",
      value: announcementsCount,
      component: PostTab,
    },
    // ...(!isPublic
    //   ? [
    //       {
    //         name: "requests" as const,
    //         value: 0,
    //         component: RequestTab,
    //       },
    //     ]
    //   : []),
  ];

  const CurrentTab = (tabs.find((item) => item.name === tab) ?? tabs[0])
    .component;

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "w-full flex items-center justify-center space-x-5",
          // isPublic && "justify-center"
        )}
      >
        {tabs.map((item) => {
          const isActive = item.name === tab;
          return (
            <Button
              size="lg"
              className={cn(
                "rounded-full w-fit py-6 px-6 first-letter:uppercase",
                !isActive && "bg-primary/10 text-primary",
                "transition-all",
              )}
              key={item.name}
              onClick={() => setTab(item.name)}
            >
              <p className="first-letter:uppercase">{item.name}</p>
              <div
                className={cn(
                  "bg-accent h-5 w-5 rounded-full text-[10px] font-extrabold flex items-center justify-center",
                  !isActive && "text-white",
                )}
              >
                <span className="h-[18px] w-fit">{item.value}</span>
              </div>
            </Button>
          );
        })}
      </div>

      <CurrentTab id={id} isPublic={isPublic} />
    </div>
  );
}

function PostTab({ id }: Props) {
  const { data: user } = useUserPropertiesQuery();
  const {
    data: announcements,
    isPending,
    isFetchingNextPage,
  } = useChannelAnnouncementsQuery({ id });

  const filteredPosts = announcements?.pages || [];

  console.log(filteredPosts);

  return (
    <div className="space-y-10">
      {filteredPosts.length > 0 &&
        filteredPosts.map((post: Post) => (
          <UserPost
            userId={user?._id}
            {...post}
            channelId={id}
            key={post._id}
          />
        ))}

      {(isPending || isFetchingNextPage) && (
        <Fragment>
          <UserPostSkeleton />
          <UserPostSkeleton />
        </Fragment>
      )}
    </div>
  );
}

// function RequestTab({}: Props) {
//   return (
//     <div>
//       <ChannelRequest username="John Doe" />
//       <ChannelRequest username="Mary Jane" />
//     </div>
//   );
// }
