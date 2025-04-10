import { ChatHeader } from "./modules/header";
import { MessageInputBox } from "./modules/input";
import { Message } from "./modules/message";

const Chat = () => {
  return (
    <div>
      <ChatHeader />
      <div className="mt-20 space-y-2.5">
        <Message content="Can we get this event started?" author="receiver" />
        <Message content="Can we get this event started?" author="sender" />
        <Message content="Can we get this event started?" author="receiver" />
      </div>
      <MessageInputBox />
    </div>
  );
};

export default Chat;
