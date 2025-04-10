import { cn } from "@/lib/utils";

type Props = {
  content: string;
  author: "sender" | "receiver";
};

export const Messages = () => {
  return <div>the better</div>;
};

export const Message = ({ content, author }: Props) => {
  return (
    <p
      className={cn(
        "bg-primary/10 max-w-[70%] w-fit p-2.5 rounded-t-2xl  text-primary text-xs font-semibold",
        author === "sender" && "rounded-bl-2xl rounded-br float-right",
        author === "receiver" && "rounded-br-2xl rounded-bl float-left"
      )}
    >
      {content}
    </p>
  );
};
