import ChatWindowLayout from "@/components/Chat/ChatWindowLayout";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ChatAppPage = () => {
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
