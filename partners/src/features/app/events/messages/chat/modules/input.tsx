import { useCallback, useEffect, useState } from "react";
import { useConversationMessageInitMutation } from "../../hooks/mutation";
import { Loader } from "@/modules/ui/button";

type Props = {
  lastMessageId?: string;
  conversationId: string;
};

export const MessageInputBox = (props: Props) => {
  const [messageInput, setMessageInput] = useState("");
  const { mutate, isPending, isSuccess, reset } =
    useConversationMessageInitMutation({
      message: messageInput,
      conversationId: props.conversationId,
    });

  const handleSuccess = useCallback(() => {
    if (isSuccess) {
      setMessageInput("");
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    handleSuccess();
  }, [isSuccess]);

  return (
    <div className="fixed bottom-0 w-full left-0 right-0 p-2 bg-background">
      <div className="rounded-full relative h-12">
        <input
          value={messageInput}
          onChange={({ target }) => {
            setMessageInput(target.value);
          }}
          type="text"
          placeholder="Type your message..."
          className="w-full h-full border-2 rounded-full border-primary/50 focus:border-primary pl-5 pr-10 placeholder:text-primary/50 text-sm font-semibold"
        />

        <button
          onClick={() => {
            mutate();
          }}
          disabled={isPending}
          className="absolute right-2 top-2.5"
        >
          {isPending ? (
            <Loader />
          ) : (
            <svg
              width="29"
              height="29"
              viewBox="0 0 29 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M27.0948 14.9774L5.28365 14.9744C5.40453 15.3251 5.60276 15.6442 5.8637 15.9078L7.73169 17.7758C7.88837 17.9317 7.97616 18.1437 7.9755 18.3647L7.97607 20.3888C7.97229 21.4905 8.40784 22.5483 9.18627 23.328C9.50822 23.6493 9.88039 23.916 10.2881 24.1177C11.6828 24.8237 13.3573 24.6771 14.6083 23.7396L26.05 16.2776C26.5389 15.9788 26.9083 15.519 27.0948 14.9774Z"
                fill="#37137F"
                fillOpacity={messageInput.length >= 1 ? "1" : "0.5"}
              />
              <path
                d="M26.0712 12.0198L14.6559 4.57731C12.8235 3.18757 10.2114 3.54644 8.82169 5.37884C8.27288 6.1025 7.97566 6.98577 7.97541 7.89399L7.97541 9.91748C7.97544 10.1386 7.88752 10.3507 7.73103 10.507L5.86304 12.375C5.60209 12.6386 5.40384 12.9577 5.28298 13.3084L27.0953 13.3066C26.913 12.7721 26.5511 12.3174 26.0712 12.0198Z"
                fill="#37137F"
                fillOpacity={messageInput.length >= 1 ? "1" : "0.5"}
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
