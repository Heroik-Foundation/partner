import { cn } from "@/lib/utils";
import { DialogHeader } from "@/modules/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/modules/ui/drawer";
import { ActionDialog } from "@/modules/units/page/action";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReactNode } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useDeletePostMutation } from "../../hooks/mutation";

type Props = {
  trigger: ReactNode;
  id: string;
};

export const PostMenu = (props: Props) => {
  const { trigger, id } = props;
  const {
    mutate: deletePost,
    isPending: isDeletingPost,
    isSuccess: deletedPost,
  } = useDeletePostMutation({ id });
  // const {
  //   mutate: flagPost,
  //   isPending: isFlaggingPost,
  //   isSuccess: flaggedPost,
  // } = useFlagPostMutation({
  //   id,
  // });
  // const {
  //   mutate: convertPostToAnnouncement,
  //   isPending: isConvertingPostToAnnouncement,
  //   isSuccess: convertedPostToAnnouncement,
  // } = usePostToAnnouncementMutation({
  //   id,
  // });

  const options = [
    // {
    //   title: "Flag Post",
    //   icon: Flag,
    //   prompt: {
    //     title: "Flag User Post",
    //     description: "Are you sure you want to flag this user's post?",
    //     callback: {
    //       fn: flagPost,
    //       isPending: isFlaggingPost,
    //       isSuccess: flaggedPost,
    //     },
    //   },
    // },
    {
      title: "Delete Post",
      icon: Trash2,
      prompt: {
        title: "Delete User Post",
        description: "Are you sure you want to delete this user's post?",
        callback: {
          fn: deletePost,
          isPending: isDeletingPost,
          isSuccess: deletedPost,
        },
      },
    },
    // {
    //   title: "Make Post Announcement",
    //   icon: Mic,
    //   prompt: {
    //     title: "Broadcast Post",
    //     description: "Are you sure you want to broadcast this post?",
    //     callback: {
    //       fn: convertPostToAnnouncement,
    //       isPending: isConvertingPostToAnnouncement,
    //       isSuccess: convertedPostToAnnouncement,
    //     },
    //   },
    // },
  ];

  return (
    <Drawer>
      <DrawerTrigger>{trigger}</DrawerTrigger>
      <DialogHeader>
        <DialogTitle></DialogTitle>
      </DialogHeader>
      <DrawerContent>
        <div className="py-5 flex items-start flex-col w-full">
          {options.map((option, index, list) => {
            const { prompt } = option;
            return (
              <ActionDialog
                key={index}
                title={prompt.title}
                description={prompt.description}
                callback={{
                  fn: prompt.callback.fn,
                  isPending: prompt.callback.isPending,
                  isSuccess: prompt.callback.isSuccess,
                }}
                trigger={
                  <button
                    key={index}
                    className={cn(
                      "flex text-primary py-3.5 space-x-1.5 px-2 w-full",
                      list.length - 1 !== index && "border-b"
                    )}
                  >
                    <option.icon className="stroke-background " size={16} />
                    <span className="text-sm font-bold">{option.title}</span>
                  </button>
                }
              />
            );
          })}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
