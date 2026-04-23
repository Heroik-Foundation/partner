import { useState } from "react";
import { useParams, useSearch } from "@tanstack/react-router";
import { SendHorizonal } from "lucide-react";

import { Header } from "../../global/header";
import { Button } from "@/modules/ui/button";
import { Textarea } from "@/modules/ui/textarea";
import { useCreatePostMutation } from "./hooks/mutation";
import { cn } from "@/lib/utils";

import { MultiImageUpload } from "./modules/multi-image-upload";

const CreatePost = () => {
  const { broadcast } = useSearch({ strict: false });
  const { id } = useParams({ strict: false });
  const [content, setContent] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);

  const { mutate, isPending } = useCreatePostMutation({
    content,
    id,
    isAnnouncement: Boolean(broadcast),
    files,
  });

  const handlePostCreation = () => {
    mutate();
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
              <span>Publish {Boolean(broadcast) ? "Broadcast" : "Post"}</span>
            </Button>
          ),
        }}
      />

      <Textarea
        value={content}
        onChange={({ target }) => setContent(target.value)}
        placeholder={
          broadcast ? "Enter Broadcast Text" : "What's on your mind?"
        }
        rows={calculatedRows}
        className={cn(
          "max-h-96 border-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-transparent",
        )}
      />

      <MultiImageUpload files={files} setFiles={setFiles} />
    </div>
  );
};

export default CreatePost;
