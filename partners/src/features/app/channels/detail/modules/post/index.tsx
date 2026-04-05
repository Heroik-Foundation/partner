import type { Post } from "@/features/app/global/types";
import { MoreHorizontal, Scaling, Heart } from "lucide-react"; // Added Scaling icon
import {
  useCreatePostDislikeMutation,
  useCreatePostLikeMutation,
} from "../../hooks/mutation";
import { useState } from "react";
import { PostMenu } from "./menu";
import { UserAvatar } from "./avatar";
import { PostActions } from "./actions";
import { Dialog, DialogContent } from "@/modules/ui/dialog"; // Assuming shadcn/ui dialog is available

const PostImages = ({
  attachments,
}: {
  attachments?: Array<{ image: string }>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [naturalSizes, setNaturalSizes] = useState<
    Record<number, { w: number; h: number }>
  >({});

  const images = attachments?.filter((a) => a.image) || [];

  if (images.length === 0) return null;

  const hasMultiple = images.length > 1;
  const firstSize = naturalSizes[0];
  const MAX_PREVIEW_PX = 120;
  const previewW = firstSize
    ? Math.min(firstSize.w, MAX_PREVIEW_PX)
    : MAX_PREVIEW_PX;
  const previewH = firstSize
    ? Math.round((firstSize.h / firstSize.w) * previewW)
    : MAX_PREVIEW_PX;

  const handleSizeLoad = (
    e: React.SyntheticEvent<HTMLImageElement>,
    idx: number,
  ) => {
    const el = e.currentTarget;
    setNaturalSizes((prev: Record<number, { w: number; h: number }>) => ({
      ...prev,
      [idx]: { w: el.naturalWidth, h: el.naturalHeight },
    }));
  };

  return (
    <>
      <div className="relative" style={{ width: previewW, height: previewH }}>
        {images.map((img, idx) => (
          <img
            key={idx}
            src={img.image}
            alt=""
            onLoad={(e) => handleSizeLoad(e, idx)}
            className="absolute top-0 left-0 w-full h-full rounded-xl object-cover"
            style={{
              transform:
                hasMultiple && idx > 0
                  ? `rotate(${idx * 3}deg) translate(${idx * 3}px, ${idx * 3}px)`
                  : undefined,
              zIndex: images.length - idx,
              boxShadow: idx > 0 ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
            }}
          />
        ))}
        <button
          onClick={() => setDialogOpen(true)}
          className="absolute top-1.5 right-1.5 p-1 bg-white/80 rounded-md shadow hover:bg-white transition-colors z-20"
          aria-label="View images"
        >
          <Scaling className="w-3.5 h-3.5 stroke-primary" />
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="p-0 bg-black/90 border-0 max-w-[90vw] w-auto">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {images.map((img, idx) => {
              const size = naturalSizes[idx];
              return (
                <img
                  key={idx}
                  src={img.image}
                  alt=""
                  onLoad={(e) => handleSizeLoad(e, idx)}
                  className="rounded-lg object-contain"
                  style={{
                    maxHeight: "80vh",
                    maxWidth: size
                      ? `min(80vw, calc(80vh * ${size.w / size.h}))`
                      : "80vw",
                    width: "auto",
                    height: "auto",
                  }}
                />
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

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
    Boolean(userId && initialLikes.includes(userId)),
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
          {/* The original SVG (unchanged) */}
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
        {/* Replaced single image with stacked preview */}
        <PostImages attachments={attachments} />

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

export const UserPostSkeleton = () => {
  return (
    <div className="w-full space-y-2.5 animate-pulse">
      {/* Header section: Avatar + actions */}
      <div className="flex items-center justify-between">
        {/* UserAvatar skeleton */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="space-y-1">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-2 w-16 bg-gray-200 rounded" />
          </div>
        </div>

        {/* Right side icons - actual icons with skeleton styling */}
        <div className="flex items-center space-x-2.5">
          {/* Original custom SVG (grayed out) */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-40"
          >
            <g clipPath="url(#clip0_530_3000_skeleton)">
              <path
                d="M19.7491 1.43213L4.32422 16.8529C4.65769 17.0154 5.02345 17.1008 5.3944 17.1027H8.03613C8.25713 17.1021 8.46915 17.19 8.62495 17.3467L10.0566 18.7776C10.833 19.5593 11.8889 19.9993 12.9906 20.0001C13.4455 19.9997 13.8973 19.9251 14.3282 19.7795C15.8136 19.2924 16.894 18.0047 17.1157 16.4573L19.9298 3.09031C20.0642 2.53334 20.0003 1.94701 19.7491 1.43213Z"
                fill="#9ca3af" // gray-400
              />
              <path
                d="M16.9338 0.064502L3.59936 2.87367C1.32096 3.18669 -0.272298 5.28745 0.0407171 7.56585C0.164354 8.46562 0.578753 9.30035 1.22079 9.94274L2.65161 11.3736C2.808 11.5299 2.8958 11.742 2.89564 11.9632V14.6049C2.89755 14.9759 2.98297 15.3417 3.14549 15.6751L18.5679 0.25025C18.0611 0.00118071 17.4836 -0.0644439 16.9338 0.064502Z"
                fill="#9ca3af"
              />
            </g>
            <defs>
              <clipPath id="clip0_530_3000_skeleton">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>

          {/* PostMenu icon (MoreHorizontal) skeleton */}
          <MoreHorizontal className="stroke-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Content section: images + text */}
      <div className="space-y-2.5">
        {/* PostImages skeleton - stacked preview look */}
        <div className="relative w-32 h-32 rounded-xl bg-gray-200" />

        {/* Content text skeleton */}
        <div className="space-y-1.5">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
      </div>

      {/* PostActions skeleton - includes actual Heart icon */}
      <div className="flex space-x-5">
        {/* Like button skeleton */}
        <div className="flex items-center space-x-1">
          <Heart
            size={24}
            className="stroke-gray-400 fill-none transition-all"
          />
          <span className="text-gray-400 font-extrabold text-sm">0</span>
        </div>
        {/* Comment button skeleton (matching your commented code) */}
        <div className="flex items-center space-x-1">
          <div className="w-6 h-6 bg-gray-200 rounded-full" />
          <div className="h-4 w-6 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const UserPostNotFound = (): JSX.Element => <div />;
