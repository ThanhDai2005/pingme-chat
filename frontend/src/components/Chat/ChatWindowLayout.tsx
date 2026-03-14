import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomScreen";
import ChatWindowSkeleton from "../Skeleton/ChatWindowSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";
import ChatWindowHeader from "./ChatWindowHeader";
import { useEffect } from "react";

const ChatWindowLayout = () => {
  const { activeConversationId, conversations, messageLoading, markAsSeen } =
    useChatStore();

  const selectedConvo = conversations.find(
    (convo) => convo._id == activeConversationId,
  );

  useEffect(() => {
    if (!selectedConvo) {
      return;
    }
    const markSeen = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.log("Lỗi khi markSeen", error);
      }
    };
    markSeen();
  }, [selectedConvo]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (messageLoading) {
    return <ChatWindowSkeleton />;
  }

  return (
    <>
      <SidebarInset className="flex flex-col flex-1 h-full overflow-hidden rounded-sm shadow-md">
        {/* Header */}
        <ChatWindowHeader chat={selectedConvo} />

        {/* Body */}
        <div className="flex-1 overflow-y-auto ">
          <ChatWindowBody />
        </div>

        {/* Footer */}
        <MessageInput selectedConvo={selectedConvo} />
      </SidebarInset>
    </>
  );
};

export default ChatWindowLayout;
