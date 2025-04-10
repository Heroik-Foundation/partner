import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { SendHorizonal } from "lucide-react";
import { toast } from "sonner";

import { Header } from "../../global/header";
import { Button } from "@/modules/ui/button";
import { Textarea } from "@/modules/ui/textarea";
import { useCreatePostMutation } from "./hooks/mutation";
import { cn } from "@/lib/utils";
import { useAnnouncementStore } from "../hooks/store/post";

const CreatePost = () => {
  const { id } = useParams({ strict: false });
  const [content, setContent] = useState<string>("");
  const { isAnnouncement } = useAnnouncementStore();

  const { mutate, isPending } = useCreatePostMutation({
    content,
    id,
  });

  const handlePostCreation = () => {
    if (content.trim().length > 3) {
      mutate();
    } else {
      toast.error("Post is too short");
    }
  };

  const calculatedRows = Math.min(Math.ceil(content.length / 34), 20);

  return (
    <div className="space-y-5">
      <Header
        header={{
          title: "",
          position: "inline",
        }}
        addOns={{
          content: (
            <Button
              onClick={handlePostCreation}
              isPending={isPending}
              className="z-10 rounded-full"
            >
              <SendHorizonal className="fill-white stroke-primary" />
              <span>Publish {isAnnouncement ? "Broadcast" : "Post"}</span>
            </Button>
          ),
        }}
      />
      <Textarea
        value={content}
        onChange={({ target }) => setContent(target.value)}
        placeholder="What's on your mind?"
        rows={calculatedRows}
        className={cn("max-h-96")}
      />
    </div>
  );
};

export default CreatePost;
