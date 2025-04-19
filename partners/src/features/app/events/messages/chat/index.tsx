import { useParams } from "@tanstack/react-router";
import { ChatHeader } from "./modules/header";
import { MessageInputBox } from "./modules/input";
import { Message } from "./modules/message";
import { useConversationMessagesQuery } from "../hooks/query";
import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";
import { Fragment, useMemo } from "react";
import { SuspenseLoader } from "@/modules/units/page/suspense";

const Chat = () => {
  const { id } = useParams({
    strict: false,
  });

  const { data } = useConversationMessagesQuery({
    conversationId: String(id),
  });
  const { data: user } = useUserPropertiesQuery();

  const rows = data || [];

  const recipient = useMemo(() => {
    if (data) {
      const initialMessage = rows[0];
      const currentUserId = user?._id;
      const messageRecipientId = initialMessage.recipient._id;

      const recipientData =
        messageRecipientId !== currentUserId
          ? initialMessage.recipient
          : initialMessage.sender;

      return recipientData;
    } else {
      return undefined;
    }
  }, [id]);

  return (
    <div>
      {recipient ? (
        <Fragment>
          <ChatHeader user={recipient} />
          <div className="mt-20 space-y-2.5">
            {rows.map((conversation, index) => {
              const message = conversation.message;
              const author =
                conversation.sender._id === user?._id ? "sender" : "receiver";
              return <Message key={index} content={message} author={author} />;
            })}
          </div>
          <MessageInputBox conversationId={String(id)} recipient={recipient} />
        </Fragment>
      ) : (
        <SuspenseLoader />
      )}
    </div>
  );
};

export default Chat;
