import { truncateText } from "@/helpers/text";
import { Link } from "@tanstack/react-router";
import { Hash } from "lucide-react";

export type ChannelProps = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  avatars: string[];
  members: number;
  nodeRef?: any;
};

export const Channel = (props: ChannelProps) => {
  const { id, title, description, thumbnail, avatars, members, nodeRef } =
    props;
  return (
    <Link
      to="/app/channels/$id"
      params={{
        id,
      }}
      className="relative flex items-start space-x-2.5 p-2.5 bg-primary rounded-2xl text-white my-1.5"
      ref={nodeRef}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt="Channel Thumbnail"
          className="rounded-lg min-w-24 max-w-24 h-24 object-cover"
          loading="eager"
        />
      ) : (
        <div className="min-w-24 h-24 bg-secondary rounded-lg flex items-center justify-center text-primary">
          <Hash />
        </div>
      )}
      <div className="space-y-1">
        <h3 className="text-sm font-black">{truncateText(title, 27)}</h3>
        <p className="text-xs font-semibold">{truncateText(description, 60)}</p>
        <div className="bg-accent py-2 px-3.5 rounded-full inline-flex space-x-2 items-center absolute bottom-2">
          <div className="relative flex items-center">
            <div className="flex -space-x-2">
              {avatars.slice(0, 3).map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full object-fill border-2 border-white"
                />
              ))}
            </div>
          </div>
          <span className="text-xs font-bold">{members} Members</span>
        </div>
      </div>
    </Link>
  );
};

export const ChannelSkeletonLoader = () => {
  return <div className="h-28 w-full bg-gray-300 animate-pulse rounded-2xl" />;
};

export const ChannelNotFound = () => {
  return (
    <div className="flex items-center justify-center bg-red-100 text-red-500 rounded-xl h-28">
      <span className="font-bold">Event Not Found</span>
    </div>
  );
};
