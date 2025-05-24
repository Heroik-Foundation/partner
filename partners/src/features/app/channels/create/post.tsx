import { useState } from "react";
import { useParams, useSearch } from "@tanstack/react-router";
import { SendHorizonal } from "lucide-react";
import { toast } from "sonner";

import { Header } from "../../global/header";
import { Button } from "@/modules/ui/button";
import { Textarea } from "@/modules/ui/textarea";
import { useCreatePostMutation } from "./hooks/mutation";
import { cn } from "@/lib/utils";
import { ImageWithPreview } from "@/modules/units/form/image";

const CreatePost = () => {
  const { broadcast } = useSearch({ strict: false });
  const { id } = useParams({ strict: false });
  const [content, setContent] = useState<string>("");
  const [file, setFile] = useState();

  const { mutate, isPending } = useCreatePostMutation({
    content,
    id,
    isAnnouncement: Boolean(broadcast),
    file,
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
              <span>Publish {Boolean(broadcast) ? "Broadcast" : "Post"}</span>
            </Button>
          ),
        }}
      />

      <ImageWithPreview
        state={file}
        setState={setFile}
        buttonText="Upload Image"
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
