import { formatOnlineTime } from "@/lib/utils";
import { Card } from "../ui/card";
import { MoreHorizontal } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import AvatarUser from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/stores/useSocketStore";

const DirectMessageCard = ({ item }) => {
  const user = useAuthStore((store) => store.user);
  const { activeConversationId, setActiveConversation, messages, getMessages } =
    useChatStore();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  const otherUser = item.participants.find((p) => p.userId._id != user?._id);
  const unreadCount = item.unreadCounts[user?._id];
  const isMe =
    item.lastMessage?.senderId._id == user?._id ||
    item.lastMessage?.senderId == user?._id;
  let lastMessageContent = "";

  if (item.lastMessage?.type == "file") {
    lastMessageContent = isMe
      ? `Bạn ${item.lastMessage?.content}`
      : `${otherUser?.userId?.displayName} ${item.lastMessage?.content}`;
  } else {
    lastMessageContent = item.lastMessage?.content;
  }
  const handleSelectConversation = async (id: string) => {
    setActiveConversation(id);
    if (!messages[id]) {
      await getMessages(id);
    }
  };

  return (
    <>
      <Card
        key={item._id}
        className={`p-3 transition-all border-none cursor-pointer glass hover:bg-muted/30 ${activeConversationId == item._id && "ring-2 ring-primary/50 bg-gradient-to-tr from-primary-glow/10 to-primary-foreground group"}`}
        onClick={() => handleSelectConversation(item._id)}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <AvatarUser
              type={"sidebar"}
              name={otherUser.userId.displayName ?? ""}
              avatarUrl={otherUser.userId.avatarUrl ?? undefined}
            />
            {/* socket io */}
            <StatusBadge
              status={
                onlineUsers.includes(otherUser.userId._id)
                  ? "online"
                  : "offline"
              }
            />
            {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h2
                className={`text-sm font-semibold truncate ${unreadCount > 0 && "text-foreground"}`}
              >
                {otherUser.userId.displayName}
              </h2>
              <span className="text-xs text-muted-foreground">
                {item.lastMessage?.createdAt
                  ? formatOnlineTime(new Date(item.lastMessage?.createdAt))
                  : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p
                className={`text-sm line-clamp-1 ${unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
              >
                {lastMessageContent}
              </p>
              <MoreHorizontal className="transition-all opacity-0 size-4 text-muted-foreground group-hover:opacity-100 hover:size-5 shrink-0" />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default DirectMessageCard;
