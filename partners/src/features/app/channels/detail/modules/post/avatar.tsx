import { getReadableTime } from "@/helpers/time";
import { UserRound } from "lucide-react";

type UserAvatarProps = {
  user: {
    photo?: string;
    logo?: string;
    fullname?: string;
  };
  createdAt: string;
};

export const UserAvatar = ({
  user,
  createdAt,
}: UserAvatarProps): JSX.Element => (
  <div className="flex items-center space-x-2">
    {user.photo || user.logo ? (
      <img
        src={user.photo || user.logo}
        alt="Profile"
        className="w-10 h-10 rounded-full border border-primary object-cover"
      />
    ) : (
      <div className="w-10 h-10 flex items-center justify-center text-primary bg-primary/20 rounded-full border border-primary">
        <UserRound size={14} />
      </div>
    )}
    <div className="flex flex-col">
      <h6 className="text-sm font-bold text-primary">
        {user.fullname || "User"}
      </h6>
      <span className="text-xs font-bold text-primary/50">
        {getReadableTime(createdAt)}
      </span>
    </div>
  </div>
);
