import { formatOnlineTime } from "@/lib/utils";
import { Card } from "../ui/card";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import GroupChatAvatar from "./GroupChatAvatar";
import UnreadCountBadge from "./UnreadCountBadge";
import { AlertTriangle, Bell, Mail, MoreHorizontal, Trash } from "lucide-react";
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

const GroupChatCard = ({ item }) => {
  const user = useAuthStore((store) => store.user);
  const {
    activeConversationId,
    setActiveConversation,
    messages,
    getMessages,
    resetMessages,
    deleteConversation,
  } = useChatStore();

  const unreadCount = item.unreadCounts[user?._id];
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
              <GroupChatAvatar participants={item.participants} type={"chat"} />
              {unreadCount > 0 && (
                <UnreadCountBadge unreadCount={unreadCount} />
              )}
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <MoreHorizontal className="transition-all opacity-0 size-4 text-muted-foreground group-hover:opacity-100 hover:size-5 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Mail className="text-current" />
                        Đánh dấu là chưa đọc
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Bell className="text-current" />
                        Tắt thông báo
                      </DropdownMenuItem>
                    </DropdownMenuGroup>

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
            <AlertDialogCancel className="border-0 text-[#0064FF] font-semibold hover:!bg-[#F2F2F2] hover:!text-[#0064FF] sm:w-[123px]">
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(item._id)}
              className="bg-[#0064FF] hover:bg-[#0057DE]  font-semibold"
            >
              Xóa đoạn chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GroupChatCard;
