import { Header } from "../../global/header";
import { Button } from "@/modules/ui/button";
import { SendHorizonal } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { Textarea } from "@/modules/ui/textarea";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { useCreatePostMutation } from "./hooks/mutation";
import { toast } from "sonner";

const CreatePost = () => {
  const { id } = useParams({
    strict: false,
  });
  const [content, setContent] = useState<string>("");
  const { mutate, isPending } = useCreatePostMutation({
    content,
    id,
  });

  const handlePostCreation = () => {
    if (content !== "" && content.length > 3) {
      mutate();
    } else {
      toast.error("Post is too short");
    }
  };

  return (
    <Fragment>
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
              className="z-10"
            >
              <SendHorizonal /> <span>Publish Post</span>
            </Button>
          ),
        }}
      />
      <Textarea
        value={content}
        onChange={({ target }) => setContent(target.value)}
        placeholder="What's on your mind ?"
      />
    </Fragment>
  );
};

export default CreatePost;
