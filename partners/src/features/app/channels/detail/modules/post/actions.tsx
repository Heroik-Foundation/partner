import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

type PostActionsProps = {
  likes: string[];
  isLiked: boolean;
  commentCount: number;
  onLikeToggle: () => void;
  postId: string;
  channelId?: string;
};

export const PostActions = ({
  likes,
  isLiked,

  onLikeToggle,
}: PostActionsProps): JSX.Element => (
  <div className="flex space-x-5">
    <button className="flex items-center space-x-1" onClick={onLikeToggle}>
      <Heart
        size={24}
        className={cn(
          "stroke-primary transition-all",
          isLiked && "fill-primary"
        )}
      />
      <span className="text-primary font-extrabold text-sm">
        {likes.length}
      </span>
    </button>
    {/* <Link
      to="/app/channels/$id/post/$postId"
      params={{
        id: String(channelId),
        postId: String(postId),
      }}
      className="flex items-center space-x-1"
    >
      <MessageSquareQuote size={24} className="stroke-primary" />
      <span className="text-primary font-extrabold text-sm">
        {commentCount}
      </span>
    </Link> */}
  </div>
);
