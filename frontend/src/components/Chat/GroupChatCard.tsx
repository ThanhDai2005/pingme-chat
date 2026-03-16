import { formatOnlineTime } from "@/lib/utils";
import { Card } from "../ui/card";
import { MoreHorizontal } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import GroupChatAvatar from "./GroupChatAvatar";
import UnreadCountBadge from "./UnreadCountBadge";

const GroupChatCard = ({ item }) => {
  const user = useAuthStore((store) => store.user);
  const { activeConversationId, setActiveConversation, messages, getMessages } =
    useChatStore();

  const unreadCount = item.unreadCounts[user?._id];
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
            <GroupChatAvatar participants={item.participants} type={"chat"} />
            {unreadCount > 0 && <UnreadCountBadge unreadCount={unreadCount} />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h2
                className={`text-sm font-semibold truncate ${unreadCount > 0 && "text-foreground"}`}
              >
                {item.group.name}
              </h2>
              <span className="text-xs text-muted-foreground">
                {item.lastMessage?.createdAt
                  ? formatOnlineTime(new Date(item.lastMessage?.createdAt))
                  : ""}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm truncate text-muted-foreground">
                {item.participants.length} thành viên
              </p>
              <MoreHorizontal className="transition-all opacity-0 size-4 text-muted-foreground group-hover:opacity-100 hover:size-5" />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default GroupChatCard;
