import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import AvatarUser from "./UserAvatar";
import GroupChatAvatar from "./GroupChatAvatar";
import StatusBadge from "./StatusBadge";
import { useSocketStore } from "@/stores/useSocketStore";

const ChatWindowHeader = ({ chat }) => {
  const user = useAuthStore((state) => state.user);
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  let otherUser;

  if (!chat) {
    return (
      <header className="sticky top-0 z-10 flex items-center h-16 gap-2 shrink-0">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
    );
  }
  if (chat.type == "direct") {
    otherUser = chat.participants.find((item) => item.userId._id != user?._id);
  }

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center h-16 gap-2 shrink-0">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          {chat.type == "direct" ? (
            <div className="relative">
              <AvatarUser
                type="sidebar"
                name={otherUser.userId.displayName ?? ""}
                avatarUrl={otherUser.userId?.avatarUrl ?? null}
              />
              {/* socket io */}
              <StatusBadge
                status={
                  onlineUsers.includes(otherUser.userId._id)
                    ? "online"
                    : "offline"
                }
              />
            </div>
          ) : (
            <>
              <GroupChatAvatar
                type="sidebar"
                participants={chat.participants}
              />
            </>
          )}
        </div>
        <h2 className="font-semibold text-foreground">
          {chat.type == "direct"
            ? otherUser.userId.displayName
            : chat.group.name}
        </h2>
      </header>
    </>
  );
};

export default ChatWindowHeader;
