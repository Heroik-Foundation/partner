import { Input } from "@/modules/ui/input";
import { useEffect, useState } from "react";
import { useCreateCommentMutation } from "../hooks/mutation";
import { Button } from "@/modules/ui/button";
import { SendHorizonal } from "lucide-react";

type CreatCommentProps = {
  id?: string;
};

export const CreateComment = ({ id }: CreatCommentProps) => {
  const [content, setContent] = useState<string>("");
  const { mutate, isPending, isSuccess } = useCreateCommentMutation({
    id,
    content,
  });

  useEffect(() => {
    if (isSuccess) {
      setContent("");
    }
  }, [isSuccess]);

  return (
    <div className="fixed bottom-5 max-w-md right-0 left-0 mx-auto px-5">
      <div className="relative">
        <Input
          value={content}
          onChange={({ target }) => {
            setContent(target.value);
          }}
          className="w-full pr-16"
        />
        <Button
          isPending={isPending}
          onClick={() => mutate()}
          disabled={content.length < 3}
          className="absolute top-2 right-2"
          size="icon"
        >
          {!isPending && <SendHorizonal />}
        </Button>
      </div>
    </div>
  );
};
