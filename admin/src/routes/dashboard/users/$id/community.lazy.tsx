import { TableBase } from "@/components/table";
import { user_columns } from "@/components/table/columns/community";
import { useUserCommunities, useUserStats } from "@/hooks/fetch/users";
import { createLazyFileRoute, useParams } from "@tanstack/react-router";
import userCommunityBadge from "@/assets/user/user-communities.svg";
import userPostsBadge from "@/assets/user/user-posts.svg";
import { Fragment } from "react/jsx-runtime";

export const Route = createLazyFileRoute("/dashboard/users/$id/community")({
  component: Page,
});

function Page() {
  const { id } = useParams({
    strict: false,
  });
  const { data, isFetching, hasNextPage, fetchNextPage } = useUserCommunities({
    id: String(id),
  });
  const { data: stats } = useUserStats({
    id: id,
  });
  const row = data?.pages.flat() || [];

  const cards = [
    {
      title: "Communities joined",
      data: 0,
      badge: userCommunityBadge,
    },
    {
      title: "Total posts",
      data: stats?.totalPosts || 0,
      badge: userPostsBadge,
    },
  ];

  return (
    <Fragment>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cards.map((item, index) => (
          <div
            key={index}
            className="w-full h-[100px] bg-white shadow rounded-xl p-4 relative mx-auto lg:mx-0"
          >
            <div className="font-cairo flex flex-col h-full justify-between">
              <span className="text-muted-foreground">{item.title}</span>
              <h3 className="text-3xl font-semibold">
                {Number(item.data).toLocaleString()}
              </h3>
            </div>
            <img
              className="absolute right-4 top-4"
              src={item.badge}
              alt="Badge icon"
            />
          </div>
        ))}
      </div>
      <div className="bg-white shadow border rounded-lg pt-5">
        <TableBase
          data={row}
          columns={user_columns}
          callback={{
            nextPage: fetchNextPage,
            hasNextPage: hasNextPage,
            isFetchingNextPage: isFetching,
          }}
        />
      </div>
    </Fragment>
  );
}
