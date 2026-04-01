import { formatOnlineTime } from "@/lib/utils";
import { Card } from "../ui/card";
import {
  AlertTriangle,
  MessageCircle,
  MoreHorizontal,
  Trash,
  UserCircle,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import AvatarUser from "./UserAvatar";
import StatusBadge from "./StatusBadge";
import UnreadCountBadge from "./UnreadCountBadge";
import { useSocketStore } from "@/stores/useSocketStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DirectMessageCard = ({ item }) => {
  const user = useAuthStore((store) => store.user);
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    getMessages,
    deleteConversation,
    resetMessages,
  } = useChatStore();
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
  } else if (item.lastMessage?.content == "đã thu hồi 1 tin nhắn") {
    lastMessageContent = isMe
      ? `Bạn ${item.lastMessage?.content}`
      : `${otherUser?.userId?.displayName} ${item.lastMessage?.content}`;
  } else {
    lastMessageContent = item.lastMessage?.content;
  }
  const handleSelectConversation = async (conversationId: string) => {
    setActiveConversation(conversationId);

    if (item.deletedAt?.[user?._id] || !messages[conversationId]) {
      resetMessages(conversationId);
      await getMessages(conversationId);
    }
  };

  const handleDelete = async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AlertDialog>
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
              {unreadCount > 0 && (
                <UnreadCountBadge unreadCount={unreadCount} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2
                  className={`text-sm font-semibold line-clamp-1 ${unreadCount > 0 && "text-foreground"}`}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="transition-all opacity-0 size-4 text-muted-foreground group-hover:opacity-100 hover:size-5 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectConversation(item._id);
                        }}
                      >
                        <MessageCircle className="text-current" />
                        Mở phần nhắn tin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <UserCircle className="text-current" />
                        Xem trang cá nhân
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Users className="text-current" />
                      Tạo nhóm
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Trash className="text-current" />
                        Xóa đoạn chat
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <AlertTriangle className="text-current" />
                      Báo cáo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Card>
        <AlertDialogContent>
          <AlertDialogHeader className="border-b border-b-[#E5E5E5]">
            <AlertDialogTitle className="w-full text-xl font-bold text-center">
              Xóa đoạn chat
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            <AlertDialogDescription className="text-[15px] text-[#1E293B]">
              Bạn không thể hoàn tác sau khi xóa bản sao của cuộc trò chuyện
              này.
            </AlertDialogDescription>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-0 text-[#0064FF] font-semibold hover:!bg-[#F2F2F2] hover:!text-[#0064FF] sm:w-[123px] cursor-pointer">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(item._id)}
              className="bg-[#0064FF] hover:bg-[#0057DE]  font-semibold cursor-pointer"
            >
              Xóa đoạn chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DirectMessageCard;
