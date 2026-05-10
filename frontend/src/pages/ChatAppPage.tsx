import ChatWindowLayout from "@/components/Chat/ChatWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useChatStore } from "@/stores/useChatStore";
import { useSearchParams } from "react-router-dom";

const ChatAppPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    getListConversation,
    setActiveConversation,
    conversations,
    getMessages,
  } = useChatStore();

  useEffect(() => {
    const conversationId = searchParams.get("conversation");

    if (conversationId) {
      getListConversation();

      const conversationExists = conversations.some(
        (convo) => convo._id == conversationId,
      );

      if (conversationExists) {
        setActiveConversation(conversationId);

        getMessages(conversationId);
      }

      setSearchParams({});
    }
  }, [
    searchParams,
    conversations,
    getMessages,
    setActiveConversation,
    setSearchParams,
  ]);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full h-screen p-2">
          <ChatWindowLayout />
        </div>
      </SidebarProvider>
    </>
  );
};

export default ChatAppPage;
