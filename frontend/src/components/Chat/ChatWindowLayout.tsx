import { useChatStore } from "@/stores/useChatStore";
import ChatWelcomeScreen from "./ChatWelcomScreen";
import ChatWindowSkeleton from "../Skeleton/ChatWindowSkeleton";
import { SidebarInset } from "../ui/sidebar";
import ChatWindowBody from "./ChatWindowBody";
import MessageInput from "./MessageInput";
import ChatWindowHeader from "./ChatWindowHeader";
import { useEffect, useState } from "react";

const ChatWindowLayout = () => {
  const {
    activeConversationId,
    conversations,
    messageLoading,
    markAsSeen,
    addImagesPreview,
  } = useChatStore();
  const [isDrag, setIsDrag] = useState(false);

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDrag(true);
  };

  const handleDragLeave = (e) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDrag(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDrag(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length == 0) return;

    const preview = files.map((file) => {
      let fileType = "file";

      if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (file.type.startsWith("video/")) {
        fileType = "video";
      }
      return {
        file: file,
        url: URL.createObjectURL(file),
        fileType: fileType,
        name: file.name,
      };
    });

    addImagesPreview(preview);
  };

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

        {/* Body & MessageInput */}
        <div
          className="relative flex flex-col flex-1 overflow-hidden"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Body */}
          <div className="flex-1 overflow-y-auto">
            <ChatWindowBody />
          </div>

          {/* Input */}
          <MessageInput selectedConvo={selectedConvo} />

          {isDrag && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none bg-white/80">
              <p className="text-lg font-semibold ">Thả tệp tại đây</p>
              <p className="text-sm text-gray-500">tối đa 100MB</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
};

export default ChatWindowLayout;
