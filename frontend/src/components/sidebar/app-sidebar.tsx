import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import CreateNewChat from "../Chat/CreateNewChat";
import NewGroupChatModel from "../Chat/NewGroupChatModel";
import GroupChatList from "../Chat/GroupChatList";
import AddFriendModal from "../Chat/AddFriendModal";
import DirectMessageList from "../Chat/DirectMessageList";
import { useThemeStore } from "@/stores/useThemeStore";
import { NavUser } from "./nav-user";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import ConversationSkeleton from "../Skeleton/ConversationSkeleton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();
  const user = useAuthStore((state) => state.user);
  const { convoLoading } = useChatStore();

  return (
    <Sidebar variant="inset" {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="bg-gradient-chat" size="lg" asChild>
              <a href="#">
                <div className="flex items-center justify-between w-full px-2">
                  <h2 className="text-xl font-bold text-white ">PingMe</h2>
                  <div className="flex items-center gap-2">
                    <Sun className="text-white/80 size-4" />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className="data-[state=checked]:bg-background/80"
                    />
                    <Moon className="text-white/80 size-4" />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="beautiful-scrollbar">
        {/* New Chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup />

        {/* Group Chat */}
        <SidebarGroup>
          <SidebarGroupLabel>NHÓM CHAT</SidebarGroupLabel>
          <SidebarGroupAction title="tạo nhóm" className="cursor-pointer">
            <NewGroupChatModel />
          </SidebarGroupAction>
          <SidebarGroupContent>
            {convoLoading ? <ConversationSkeleton /> : <GroupChatList />}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Dirrect Message */}
        <SidebarGroup>
          <SidebarGroupLabel>BẠN BÈ</SidebarGroupLabel>
          <SidebarGroupAction title="kết bạn" className="cursor-pointer">
            <AddFriendModal />
          </SidebarGroupAction>
          <SidebarGroupContent>
            {convoLoading ? <ConversationSkeleton /> : <DirectMessageList />}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
