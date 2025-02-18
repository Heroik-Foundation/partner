import type { Comment } from "@/features/app/global/types";
import { getReadableTime } from "@/helpers/time";
import { cn } from "@/lib/utils";
import { Heart, UserRound } from "lucide-react";
import { useState } from "react";
import {
  useCreateCommentDislikeMutation,
  useCreateCommentLikeMutation,
} from "../hooks/mutation";

type CommentProps = {
  nodeRef?: any;
  userId?: string;
} & Comment;

export const UserComment = (props: CommentProps) => {
  const { content, likes: initialLikes, user, createdAt, _id, userId } = props;

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(
    userId && initialLikes.includes(userId)
  );

  const { mutate: likePost } = useCreateCommentLikeMutation({
    id: _id,
    onError: () => {
      setLikes(initialLikes);
      setIsLiked(userId && initialLikes.includes(userId));
    },
  });

  const { mutate: dislikePost } = useCreateCommentDislikeMutation({
    id: _id,
    onError: () => {
      setLikes(initialLikes);
      setIsLiked(userId && initialLikes.includes(userId));
    },
  });

  const handleLikeToggle = () => {
    if (!userId) return;

    if (isLiked) {
      setLikes((prev) => prev.filter((id) => id !== userId));
      setIsLiked(false);
      dislikePost();
    } else {
      setLikes((prev) => [...prev, userId]);
      setIsLiked(true);
      likePost();
    }
  };

  return (
    <div className="w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {user.photo ? (
            <img
              src={user.photo}
              alt="PP"
              className="w-10 h-10 rounded-full border border-primary object-cover"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center text-primary bg-primary/20 rounded-full">
              <UserRound />
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
        <div />
      </div>
      <p className="font-medium text-sm text-primary">{content}</p>
      <div className="flex space-x-5">
        <button
          className="flex items-center space-x-1"
          onClick={handleLikeToggle}
        >
          <Heart
            size={22}
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
            postId: String(_id),
          }}
          className="flex items-center space-x-1"
        >
          <MessageSquareQuote size={22} className={cn("stroke-primary")} />
          <span className="text-primary font-extrabold text-sm">
            {comments.length}
          </span>
        </Link> */}
      </div>
    </div>
  );
};

export const UserCommentLoader = () => {
  return <div className="h-40 w-full rounded-lg bg-gray-300 animate-pulse" />;
};

export const UserPostNotFound = () => {
  return <div></div>;
};
