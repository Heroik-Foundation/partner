import { Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";

export type ChannelProps = {
  id: string;
  title: string;
  thumbnail: string;
  avatars: string[];
  members: number;
};

export const Channel = ({
  id,
  title,
  thumbnail,
  avatars,
  members,
}: ChannelProps) => {
  const truncatedTitle = title.length > 20 ? `${title.slice(0, 20)}...` : title;

  return (
    <Link
      to="/app/channels/$id"
      params={{ id }}
      className="relative h-20 flex items-center gap-2.5 p-1 bg-primary rounded-2xl text-white"
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Channel Thumbnail"
          className="rounded-xl w-[72px] h-[72px] object-cover"
        />
      ) : (
        <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center text-primary">
          <Hash />
        </div>
      )}

      <div className="space-y-1 flex flex-col h-full py-2">
        <h3 className="text-sm font-black">{truncatedTitle}</h3>

        <div className="bg-accent py-1.5 px-3.5 rounded-full inline-flex gap-2 items-center absolute bottom-2">
          <div className="flex -space-x-2">
            {avatars.slice(0, 3).map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt="Avatar"
                className="w-5 h-5 rounded-full border-2 border-white"
              />
            ))}
          </div>
          <span className="text-xs font-bold">{members} Members</span>
        </div>
      </div>
    </Link>
  );
};

export const ChannelSkeletonLoader = () => (
  <div className="h-28 w-full bg-gray-300 animate-pulse rounded-2xl" />
);

export const ChannelNotFound = () => (
  <div className="flex items-center justify-center bg-red-100 text-red-500 rounded-xl h-28">
    <span className="font-bold">Event Not Found</span>
  </div>
);
