import { useChatStore } from "@/stores/useChatStore";
import MessageItem from "./MessageItem";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatWindowBody = () => {
  const { activeConversationId, conversations, messages, getMessages } =
    useChatStore();
  const [lastMessageStatus, setLastMessageStatus] = useState("sent");
  const scrollRef = useRef(null);
  const containerRef = useRef(null);
  const key = `chat-scroll-${activeConversationId}`;

  const messageList = messages[activeConversationId]?.items ?? [];
  const reverseMessageList = [...messageList].reverse();
  const hasMore = messages[activeConversationId]?.hasMore ?? false;
  const selectedConvo = conversations.find(
    (convo) => convo._id == activeConversationId,
  );

  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage;

    if (!lastMessage) {
      return;
    }

    const seenBy = selectedConvo.seenBy ?? [];

    setLastMessageStatus(seenBy.length > 0 ? "seen" : "sent");
  }, [selectedConvo]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [activeConversationId]);

  const fetchMoreMessage = async () => {
    if (!activeConversationId) {
      return;
    }
    try {
      await getMessages(activeConversationId);
    } catch (error) {
      console.log("Lỗi xảy ra khi fetch thêm tin", error);
    }
  };

  const handleScrollSave = () => {
    if (!containerRef.current || !activeConversationId) return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollTop: containerRef.current.scrollTop, // lấy vị trí cuộn hiện tại
      }),
    );
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const item = sessionStorage.getItem(key);

    if (item) {
      const { scrollTop } = JSON.parse(item);

      // đợi trình duyệt vẽ xong đống tin nhắn này lên màn hình đã, rồi hãy nhảy tới vị trí cuộn đó
      requestAnimationFrame(() => {
        containerRef.current.scrollTop = scrollTop;
      });
    }
  }, [messageList.length]);

  if (messageList.length == 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={handleScrollSave}
        id="scrollableDiv"
        className="flex flex-col-reverse h-full p-4 overflow-x-hidden overflow-y-auto beautiful-scrollbar"
      >
        <div ref={scrollRef}></div>
        <InfiniteScroll
          dataLength={messageList.length}
          next={fetchMoreMessage}
          hasMore={hasMore}
          scrollableTarget="scrollableDiv"
          loader={<p>Đang tải...</p>}
          inverse={true}
          style={{
            display: "flex",
            flexDirection: "column-reverse",
            overflow: "visible",
          }}
        >
          {reverseMessageList.map((mess, index) => (
            <MessageItem
              key={mess?._id}
              mess={mess}
              index={index}
              messageList={reverseMessageList}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default ChatWindowBody;
