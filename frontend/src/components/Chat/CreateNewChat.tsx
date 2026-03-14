import { useFriendStore } from "@/stores/useFriendStore";
import { MessageCircle, MessageCircleMore, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card } from "../ui/card";
import AvatarUser from "./UserAvatar";
import { useChatStore } from "@/stores/useChatStore";
import { useState } from "react";

export const CreateNewChat = () => {
  const [open, setOpen] = useState(false);
  const { getAllFriends, friendList } = useFriendStore();
  const { createConversation } = useChatStore();

  const getFriendList = async () => {
    try {
      await getAllFriends();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenConversation = async (id) => {
    try {
      await createConversation("direct", "", [id]);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card
        className="p-3 transition-all cursor-pointer hover:shadow-soft glass group/card"
        onClick={getFriendList}
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center gap-4 ">
              <div className="flex items-center justify-center transition-all duration-300 rounded-full size-8 bg-gradient-chat group-hover/card:scale-110">
                <MessageCircle className="text-white size-4" />
              </div>

              <div className="text-sm font-semibold">Gửi Tin Nhắn Mới</div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <MessageCircleMore className="size-5" />
                Bắt Đầu Hội Thoại Mới
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm font-semibold tracking-wide text-muted-foreground">
                DANH SÁCH BẠN BÈ
              </div>

              <div className="space-y-2 overflow-y-auto max-h-60">
                {friendList.map((item) => (
                  <Card
                    key={item._id}
                    className="p-3 transition-all cursor-pointer hover:bg-muted/30 glass hover:shadow-soft group/friendCard"
                    onClick={() => handleOpenConversation(item._id)}
                  >
                    <div className="flex items-center gap-3">
                      <AvatarUser
                        type={"sidebar"}
                        name={item.displayName}
                        avatarUrl={item.avatarUrl}
                      />
                      <div className="text-sm font-semibold truncate">
                        {item.displayName}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {friendList.length == 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <Users className="mx-auto mb-3 opacity-50 size-12" />
                  Chưa có bạn bè. Hãy đi kết bạn thôi lào!
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
};

export default CreateNewChat;
