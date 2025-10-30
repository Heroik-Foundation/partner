import type { Post } from "@/features/app/global/types";
import { MoreHorizontal } from "lucide-react";
import {
  useCreatePostDislikeMutation,
  useCreatePostLikeMutation,
} from "../../hooks/mutation";
import { useState } from "react";
import { PostMenu } from "./menu";
import { UserAvatar } from "./avatar";
import { PostActions } from "./actions";

type PostProps = Post & {
  nodeRef?: React.RefObject<HTMLDivElement>;
  userId?: string;
  channelId?: string;
};

export const UserPost = ({
  content,
  likes: initialLikes,
  comments,
  user,
  createdAt,
  _id,
  userId,
  channelId,
  nodeRef,
  attachments,
}: PostProps) => {
  const [likes, setLikes] = useState<string[]>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(
    Boolean(userId && initialLikes.includes(userId))
  );

  const { mutate: likePost } = useCreatePostLikeMutation({
    id: _id,
    onError: () => {
      setLikes(initialLikes);
      setIsLiked(Boolean(userId && initialLikes.includes(userId)));
    },
  });

  const { mutate: dislikePost } = useCreatePostDislikeMutation({
    id: _id,
    onError: () => {
      setLikes(initialLikes);
      setIsLiked(Boolean(userId && initialLikes.includes(userId)));
    },
  });

  const handleLikeToggle = (): void => {
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
    <div className="w-full space-y-2.5" ref={nodeRef}>
      <div className="flex items-center justify-between">
        <UserAvatar user={user} createdAt={createdAt} />
        <div className="flex items-center space-x-2.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_530_3000)">
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
          <PostMenu
            id={_id}
            trigger={<MoreHorizontal className="stroke-primary" />}
          />
        </div>
      </div>
      <div className="space-y-2.5">
        {/* @ts-ignore  */}
        {attachments && attachments[0] && attachments[0].image && (
          <img
            className="rounded-xl object-cover object-center w-28 h-28"
            src={attachments[0].image}
            alt=""
          />
        )}
        <p className="font-medium text-sm text-primary break-words">
          {content}
        </p>
      </div>
      <PostActions
        likes={likes}
        isLiked={isLiked}
        commentCount={comments.length}
        onLikeToggle={handleLikeToggle}
        postId={_id}
        channelId={channelId}
      />
    </div>
  );
};

export const UserPostLoader = (): JSX.Element => (
  <div className="h-40 w-full rounded-lg bg-gray-300 animate-pulse" />
);

export const UserPostNotFound = (): JSX.Element => <div />;
