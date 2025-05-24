import { Link, useParams } from "@tanstack/react-router";
import { useChannelDetailsQuery } from "../hooks/query";
import { SuspenseLoader } from "@/modules/units/page/suspense";
import { Highlight } from "./modules/highlight";
import { UserPost, UserPostLoader } from "./modules/post";
import { Button, buttonVariants } from "@/modules/ui/button";
import { cn } from "@/lib/utils";
import { Post } from "../../global/types";
import { useChannelAnnouncementsQuery } from "./hooks/query";
import { Header } from "../../global/header";
import { useUserPropertiesQuery } from "../../global/hooks/query";
import { Actions } from "./modules/actions";

const ChannelDetails = () => {
  const { id } = useParams({ strict: false }) as { id: string };
  const { data: user } = useUserPropertiesQuery();
  const { data: channel } = useChannelDetailsQuery({ id });

  const { data: announcements } = useChannelAnnouncementsQuery({ id });

  const filteredPosts = announcements?.pages || [];

  return (
    <div className="space-y-5 min-h-screen">
      <Header
        header={{
          title: "",
          position: "inline",
        }}
        previousButtonVariant="backlight-faded"
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
                    "bg-white text-primary font-bold z-10 hover:bg-white rounded-full px-5 items-center",
                })
              )}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_530_3185)">
                  <path
                    d="M12 12.6667V15.8C12.4705 15.6387 12.8987 15.3735 13.2527 15.024L15.0233 13.252C15.3732 12.8985 15.6387 12.4705 15.8 12H12.6667C12.4899 12 12.3203 12.0702 12.1953 12.1953C12.0702 12.3203 12 12.4899 12 12.6667Z"
                    fill="#2E008B"
                  />
                  <path
                    d="M4.78133 9.21866C4.53361 9.4663 4.33711 9.76032 4.20305 10.0839C4.06898 10.4075 3.99999 10.7544 4 11.1047V12H4.89533C5.24561 12 5.59246 11.931 5.91606 11.7969C6.23967 11.6629 6.53369 11.4664 6.78133 11.2187L14.3333 3.66666C14.5985 3.40144 14.7475 3.04173 14.7475 2.66665C14.7475 2.29158 14.5985 1.93187 14.3333 1.66666C14.0681 1.40144 13.7084 1.25244 13.3333 1.25244C12.9583 1.25244 12.5985 1.40144 12.3333 1.66666L4.78133 9.21866Z"
                    fill="#2E008B"
                  />
                  <path
                    d="M16 3.30133C15.8865 3.79587 15.6371 4.24888 15.28 4.60933L7.724 12.162C7.35338 12.5346 6.91254 12.8299 6.42699 13.031C5.94145 13.2321 5.42086 13.3348 4.89533 13.3333H4C3.64638 13.3333 3.30724 13.1929 3.05719 12.9428C2.80714 12.6928 2.66667 12.3536 2.66667 12V11.1047C2.66521 10.5792 2.76805 10.0586 2.96923 9.5732C3.17041 9.08776 3.46593 8.64707 3.83867 8.27667L11.3907 0.724C11.7484 0.366359 12.1989 0.115626 12.6913 0C12.6827 0 12.6753 0 12.6667 0H3.33333C2.4496 0.00105857 1.60237 0.352588 0.97748 0.97748C0.352588 1.60237 0.00105857 2.4496 0 3.33333L0 12.6667C0.00105857 13.5504 0.352588 14.3976 0.97748 15.0225C1.60237 15.6474 2.4496 15.9989 3.33333 16H10.6667V12.6667C10.6667 12.1362 10.8774 11.6275 11.2525 11.2525C11.6275 10.8774 12.1362 10.6667 12.6667 10.6667H16V3.33333C16 3.32267 16 3.31267 16 3.30133Z"
                    fill="#2E008B"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_530_3185">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>

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
          id={id}
        />
      )}
      {!channel && <SuspenseLoader />}

      <div className="w-full flex items-center justify-around space-x-5">
        <Button size={"lg"} className={cn("rounded-full w-fit py-6 px-6")}>
          Announcements
        </Button>
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
          <UserPostLoader /> <UserPostLoader />
        </>
      )}
      <Actions id={id} />
    </div>
  );
};

export default ChannelDetails;
