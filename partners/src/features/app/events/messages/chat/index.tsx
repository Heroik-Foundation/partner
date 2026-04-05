import { useParams } from "@tanstack/react-router";
import { ChatHeader } from "./modules/header";
import { MessageInputBox } from "./modules/input";
import { Message, Messages } from "./modules/message";
import { useConversationMessagesQuery } from "../hooks/query";
import { SuspenseLoader } from "@/modules/units/page/suspense";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo } from "react";
import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import type { Message as MessageItem } from "@/features/app/global/types";
import { ItemNotFound } from "@/modules/units/card/not-found";
import { useWebSocket } from "@/hooks/web-socket";

const Chat = () => {
  const { id } = useParams({ strict: false });
  const { data, isPending } = useConversationMessagesQuery({
    conversationId: String(id),
  });
  const { data: user } = useUserPropertiesQuery();
  const { markConversationAsRead } = useWebSocket();

  const sortedMessages = useMemo(() => {
    if (!data) return [];
    return [...data].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
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
      fullname: senderData.fullname || "Unknown",
      photo: senderData.photo || "",
      id: senderData._id,
    };
  }, [sortedMessages, user?._id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  };

  useEffect(() => {
    if (id) {
      markConversationAsRead(String(id));
    }
  }, [id]);

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
    <div className="flex flex-col h-full">
      <ChatHeader user={sender} />

      <motion.div
        className="flex-1 overflow-y-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Messages>
          <AnimatePresence>
            {sortedMessages.map((message: MessageItem, index: number) => {
              const author =
                message.sender._id === user?._id ? "sender" : "receiver";
              return (
                <Message
                  key={`${message._id}-${message.createdAt}`}
                  content={message.message}
                  author={author}
                  index={index}
                />
              );
            })}
          </AnimatePresence>
        </Messages>
      </motion.div>

      <MessageInputBox conversationId={String(id)} />
    </div>
  );
};

export default Chat;
