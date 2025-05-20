import { useParams } from "@tanstack/react-router";
import { ChatHeader } from "./modules/header";
import { MessageInputBox } from "./modules/input";
import { Message } from "./modules/message";
import { useConversationMessagesQuery } from "../hooks/query";
import { SuspenseLoader } from "@/modules/units/page/suspense";

import { useMemo } from "react";
import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import type { Message as MessageItem } from "@/features/app/global/types";
import { ItemNotFound } from "@/modules/units/card/not-found";

const Chat = () => {
  const { id } = useParams({ strict: false });
  const { data, isPending } = useConversationMessagesQuery({
    conversationId: String(id),
  });
  const { data: user } = useUserPropertiesQuery();

  const sortedMessages = useMemo(() => {
    if (!data) return [];
    return [...data].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [data]);

  const sender = useMemo(() => {
    if (!sortedMessages.length) return null;
    const firstMessage = sortedMessages[0];
    const senderData =
      firstMessage.sender._id === user?._id
        ? firstMessage.recipient
        : firstMessage.sender;
    return {
      fullname: senderData.fullname || senderData.fullname || "Unknown",
      photo: senderData.photo || senderData.photo || "",
      id: senderData._id,
    };
  }, [sortedMessages, user?._id]);

  if (isPending) return <SuspenseLoader />;
  if (!data || !sender)
    return (
      <div>
        <ChatHeader
          user={{
            fullname: sender?.fullname,
            photo: sender?.photo,
          }}
        />

        <ItemNotFound message="Conversation Not Found" />
      </div>
    );

  return (
    <div>
      <ChatHeader user={sender} />
      <div className="mt-20 space-y-2.5">
        {sortedMessages.map((message: MessageItem) => {
          const author =
            message.sender._id === user?._id ? "sender" : "receiver";
          return (
            <Message
              key={`${message._id}-${message.createdAt}`}
              content={message.message}
              author={author}
            />
          );
        })}
      </div>
      <MessageInputBox conversationId={String(id)} recipientId={sender.id} />
    </div>
  );
};

export default Chat;
