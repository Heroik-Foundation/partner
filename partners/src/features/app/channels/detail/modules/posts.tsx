import type { Post } from "@/features/app/global/types";
import { getReadableTime } from "@/helpers/time";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Heart, MessageSquareQuote, Send, UserRound } from "lucide-react";
import {
  useCreatePostDislikeMutation,
  useCreatePostLikeMutation,
} from "../hooks/mutation";
import { useState } from "react";

type PostProps = {
  nodeRef?: any;
  userId?: string;
  channelId?: string;
} & Post;

export const UserPost = (props: PostProps) => {
  const {
    content,
    likes: initialLikes,
    comments,
    user,
    createdAt,
    _id,
    userId,
    channelId,
  } = props;

  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(
    userId && initialLikes.includes(userId)
  );

  const { mutate: likePost } = useCreatePostLikeMutation({
    id: _id,
    onError: () => {
      setLikes(initialLikes);
      setIsLiked(userId && initialLikes.includes(userId));
    },
  });

  const { mutate: dislikePost } = useCreatePostDislikeMutation({
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
        <div className="flex items-center space-x-2.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_530_3000)">
              <path
                d="M19.7491 1.43213L4.32422 16.8529C4.65769 17.0154 5.02345 17.1008 5.3944 17.1027H8.03613C8.25713 17.1021 8.46915 17.19 8.62495 17.3467L10.0566 18.7776C10.833 19.5593 11.8889 19.9993 12.9906 20.0001C13.4455 19.9997 13.8973 19.9251 14.3282 19.7795C15.8136 19.2924 16.894 18.0047 17.1157 16.4573L19.9298 3.09031C20.0642 2.53334 20.0003 1.94701 19.7491 1.43213Z"
                fill="#37137F"
              />
              <path
                d="M16.9338 0.064502L3.59936 2.87367C1.32096 3.18669 -0.272298 5.28745 0.0407171 7.56585C0.164354 8.46562 0.578753 9.30035 1.22079 9.94274L2.65161 11.3736C2.808 11.5299 2.8958 11.742 2.89564 11.9632V14.6049C2.89755 14.9759 2.98297 15.3417 3.14549 15.6751L18.5679 0.25025C18.0611 0.00118071 17.4836 -0.0644439 16.9338 0.064502Z"
                fill="#37137F"
              />
            </g>
            <defs>
              <clipPath id="clip0_530_3000">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <svg
            width="18"
            height="6"
            viewBox="0 0 18 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M2.07692 5.14282C0.92987 5.14282 0 4.18343 0 2.99996C0 1.8165 0.92987 0.857108 2.07692 0.857108C3.22398 0.857108 4.15385 1.8165 4.15385 2.99997C4.15385 4.18343 3.22398 5.14282 2.07692 5.14282ZM9 5.14282C7.85295 5.14282 6.92308 4.18343 6.92308 2.99996C6.92308 1.8165 7.85295 0.857108 9 0.857108C10.1471 0.857108 11.0769 1.8165 11.0769 2.99997C11.0769 4.18343 10.1471 5.14282 9 5.14282ZM15.9231 5.14282C14.776 5.14282 13.8462 4.18343 13.8462 2.99996C13.8462 1.8165 14.776 0.857108 15.9231 0.857108C17.0701 0.857108 18 1.8165 18 2.99997C18 4.18343 17.0701 5.14282 15.9231 5.14282Z"
              fill="#37137F"
            />
          </svg>
        </div>
      </div>
      <p className="font-medium text-sm text-primary">{content}</p>
      <div className="flex space-x-5">
        <button
          className="flex items-center space-x-1"
          onClick={handleLikeToggle}
        >
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
        <Link
          to="/app/channels/$id/post/$postId"
          params={{
            id: String(channelId),
            postId: String(_id),
          }}
          className="flex items-center space-x-1"
        >
          <MessageSquareQuote size={24} className={cn("stroke-primary")} />
          <span className="text-primary font-extrabold text-sm">
            {comments.length}
          </span>
        </Link>
      </div>
    </div>
  );
};

export const UserPostLoader = () => {
  return <div className="h-40 w-full rounded-lg bg-gray-300 animate-pulse" />;
};

export const UserPostNotFound = () => {
  return <div></div>;
};
