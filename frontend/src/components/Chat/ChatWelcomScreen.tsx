import { SidebarInset } from "../ui/sidebar";
import ChatWindowHeader from "./ChatWindowHeader";

const ChatWelcomeScreen = () => {
  return (
    <>
      <SidebarInset className="flex flex-col h-full bg-primary-foreground rounded-2xl ">
        <ChatWindowHeader />
        <div className="flex flex-col items-center justify-center grow">
          <div className="flex items-center justify-center mx-auto mb-6 rounded-full size-24 bg-gradient-chat shadow-glow pulse-ring">
            <span className="text-3xl">💬</span>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-transparent bg-gradient-chat bg-clip-text">
            Chào mừng bạn đến với Moji!
          </h2>
          <p className="text-muted-foreground">
            Chọn một cuộc hội thoại để bắt đầu chat!
          </p>
        </div>
      </SidebarInset>
    </>
  );
};

export default ChatWelcomeScreen;
