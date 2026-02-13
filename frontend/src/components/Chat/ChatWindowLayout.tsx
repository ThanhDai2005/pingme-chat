import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomScreen";
import ChatWindowSkeleton from "./ChatWindowSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWindowLayout = () => {
  const { activeConversationId, conversations, messageLoading, messages } =
    useChatStore();

  const selectedConvo = conversations.find(
    (convo) => convo._id == activeConversationId,
  );

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (messageLoading) {
    return <ChatWindowSkeleton />;
  }

  return (
    <>
      <SidebarInset className="flex flex-col h-full overflow-hidden rounded-sm shadow-md">
        {/* Header */}
        <ChatWindowHeader chat={selectedConvo} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-primary-foreground">
          <ChatWindowBody />
        </div>

        {/* Footer */}
        <MessageInput selectedConvo={selectedConvo} />
      </SidebarInset>
    </>
  );
};

export default ChatWindowLayout;
