import { useParams } from "@tanstack/react-router";
import { ChatHeader } from "./modules/header";
import { MessageInputBox } from "./modules/input";
import { Message } from "./modules/message";
import { useConversationMessagesQuery } from "../hooks/query";

import { SuspenseLoader } from "@/modules/units/page/suspense";
import { Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
import { useUserPropertiesQuery } from "@/features/app/global/hooks/query";

const Chat = () => {
  const { id } = useParams({
    strict: false,
  });

  const { data, isPending } = useConversationMessagesQuery({
    conversationId: String(id),
  });

  const { data: user } = useUserPropertiesQuery();

  const rows = useMemo(() => {
    const valid = data || [];

    return valid;
  }, [data]);

  const sender = {
    fullname: rows[0]?.sender?.fullname || "Unknown",
    photo: rows[0]?.sender?.photo || "",
    id: rows[0]?.sender?._id || "",
  };

  return (
    <div>
      {data && sender && (
        <Fragment>
          <ChatHeader user={sender} />
          <div className="mt-20 space-y-2.5">
            {rows.map((conversation, index) => {
              const message = conversation.message;
              const author =
                conversation.sender._id === user?._id ? "sender" : "receiver";
              return <Message key={index} content={message} author={author} />;
            })}
          </div>
          <MessageInputBox
            conversationId={String(id)}
            recipientId={sender.id}
          />
        </Fragment>
      )}

      {isPending && <SuspenseLoader />}
    </div>
  );
};

export default Chat;
