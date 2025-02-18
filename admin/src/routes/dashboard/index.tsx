import { createFileRoute } from "@tanstack/react-router";
import userBg from "@/assets/reports/backgrounds/one.svg";
import revenueBg from "@/assets/reports/backgrounds/two.svg";
import donationBg from "@/assets/reports/backgrounds/three.svg";
import charityBg from "@/assets/reports/backgrounds/four.svg";
import donorBg from "@/assets/reports/backgrounds/five.svg";
import eventBg from "@/assets/reports/backgrounds/six.svg";
import postBg from "@/assets/reports/backgrounds/seven.svg";
import communityBg from "@/assets/reports/backgrounds/eight.svg";
import user from "@/assets/reports/icons/user.svg";
import users from "@/assets/reports/icons/users.svg";
import event from "@/assets/reports/icons/events.svg";
import heart from "@/assets/reports/icons/favourite.svg";
import post from "@/assets/reports/icons/posts.svg";
import box from "@/assets/reports/icons/box.svg";
import money from "@/assets/reports/icons/money.svg";
import { useReports } from "@/hooks/fetch/reports";
import { PageTitle } from "@/components/layout/page-title";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard/")({
  component: Page,
});

function Page() {
  const { data } = useReports();

  const cards = [
    {
      title: "Total users",
      data: data?.users || 0,
      icon: user,
      bg: userBg,
    },
    {
      title: "Total revenue",
      data: data?.revenue || 0,
      icon: users,
      bg: revenueBg,
    },
    {
      title: "Total monetary donations",
      data: data?.totalDonations || 0,
      icon: money,
      bg: donationBg,
    },
    {
      title: "Total charity organizations",
      data: data?.charities || 0,
      icon: heart,
      bg: charityBg,
    },
    {
      title: "Total tax",
      data: data?.tax || 0,
      icon: box,
      bg: donorBg,
    },
    {
      title: "Total events",
      data: data?.events || 0,
      icon: event,
      bg: eventBg,
    },
    {
      title: "Total posts",
      data: data?.posts || 0,
      icon: post,
      bg: postBg,
    },
    {
      title: "Total communities",
      data: data?.communities || 0,
      icon: users,
      bg: communityBg,
    },
  ];

  return (
    <div className="space-y-10">
      <PageTitle
        title="Welcome back"
        subTitle=" So far on the Hiroek journey"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <div
            style={{
              backgroundImage: `url(${card.bg})`,
            }}
            className={cn(
              "flex items-start flex-col justify-between p-5 rounded-xl mx-auto w-[264px] h-[140px] bg-no-repeat bg-fill bg-center bg-white"
            )}
            key={index}
          >
            <div className="p-2 rounded bg-white/20">
              <img src={card.icon} alt="" />
            </div>
            <div>
              <span className="font-medium text-white/80">{card.title}</span>
              <h3 className="text-3xl font-medium text-white">
                {[
                  "Total monetary donations",
                  "Total tax",
                  "Total revenue",
                ].includes(card.title) && `£ `}

                <CountUp end={card.data} duration={5} />
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
