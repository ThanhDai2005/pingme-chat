import { useChatStore } from "@/stores/useChatStore";
import MessageItem from "./MessageItem";

const ChatWindowBody = () => {
  const { activeConversationId, conversations, messages } = useChatStore();

  const messageList = messages[activeConversationId].items ?? null;
  const selectedConvo = conversations.find(
    (convo) => convo._id == activeConversationId,
  );

  if (!messageList.length) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full p-4 overflow-hidden bg-primary-foreground">
        <div className="flex flex-col overflow-x-hidden overflow-y-auto beautiful-scrollbar">
          {messageList.map((mess, index) => (
            <MessageItem
              key={mess._id}
              mess={mess}
              index={index}
              messageList={messageList}
              selectedConvo={selectedConvo}
              lastMessageStatus={"sent"}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatWindowBody;
