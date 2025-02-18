import { Link, useParams } from "@tanstack/react-router";
import { useChannelDetailsQuery } from "../hooks/query";
import { Fallback } from "@/modules/ui/units/suspense";
import { Highlight } from "./modules/highlight";
import { UserPost, UserPostLoader } from "./modules/posts";
import { useState } from "react";
import { Button, buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import { Post } from "../../global/types";
import { useChannelPostsQuery } from "./hooks/query";
import { Header } from "../../global/header";
import { Pencil } from "lucide-react";
import { useUserPropertiesQuery } from "../../global/hooks/query";
import { CreatePostLink } from "./modules/link";

type Tab = "posts" | "announcements";

const ChannelDetails = () => {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: user } = useUserPropertiesQuery();
  const [currentTab, setCurrentTab] = useState<Tab>("posts");
  const { data: channel } = useChannelDetailsQuery({ id });
  const { data: posts } = useChannelPostsQuery({ id });

  const filteredPosts = posts?.pages.filter((post: Post) =>
    currentTab === "announcements" ? post.isAnnouncement : true
  );

  return (
    <div className="space-y-5 min-h-screen">
      <Header
        header={{
          title: "",
          position: "inline",
        }}
        previousButtonVariant="backlight"
        addOns={{
          content: user?._id === channel?.admin._id && (
            <Link
              to="/app/channels/$id/edit"
              params={{
                id,
              }}
              className={cn(
                buttonVariants({
                  variant: "default",
                  className:
                    "bg-white text-primary font-bold z-10 hover:bg-white",
                })
              )}
            >
              <Pencil size="14" />
              <span>Edit Channel</span>
            </Link>
          ),
        }}
      />
      {channel && (
        <Highlight
          title={channel.name}
          description={channel.description}
          members={channel.members.length}
          avatars={channel.members.map((member) => member.photo)}
          thumbnail={channel.photo}
        />
      )}
      {!channel && <Fallback />}
      <div className="w-full flex items-center justify-between space-x-5">
        {(["posts", "announcements"] as Tab[]).map((tab) => (
          <Button
            key={tab}
            className={cn("rounded-full w-full")}
            variant={tab === currentTab ? "default" : "outline"}
            onClick={() => setCurrentTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>
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
          {" "}
          <UserPostLoader /> <UserPostLoader />
        </>
      )}
      {id && <CreatePostLink id={id} />}
    </div>
  );
};

export default ChannelDetails;
