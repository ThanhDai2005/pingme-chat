import { useFriendStore } from "@/stores/useFriendStore";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Users, X } from "lucide-react";
import AvatarUser from "./UserAvatar";
import { useChatStore } from "@/stores/useChatStore";
import { toast } from "sonner";

const NewGroupChatModel = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [invitedUser, setInvitedUser] = useState([]);

  const { getAllFriends, friendList } = useFriendStore();
  const { createConversation, loading } = useChatStore();

  const getFriendList = async () => {
    try {
      await getAllFriends();
    } catch (error) {
      console.log(error);
    }
  };

  const searchFriend =
    search.trim().length > 0
      ? friendList.filter(
          (item) =>
            item.displayName.toLowerCase().includes(search.toLowerCase()) &&
            !invitedUser.some((invite) => invite._id == item._id),
        )
      : [];

  const handleSelectFriend = (friend) => {
    setInvitedUser([...invitedUser, friend]);
    setSearch("");
  };

  const handleRemoveFriend = (friend) => {
    setInvitedUser(invitedUser.filter((item) => item._id != friend._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (invitedUser.length == 0) {
        toast.warning("Hãy thêm thành viên để có thể tạo nhóm");
        return;
      } else if (invitedUser.length == 1) {
        await createConversation(
          "direct",
          "",
          invitedUser.map((item) => item._id),
        );
      } else {
        await createConversation(
          "group",
          name,
          invitedUser.map((item) => item._id),
        );
      }

      setInvitedUser([]);
      setSearch("");
      setName("");
      setOpen(false);
    } catch (error) {
      console.log("Lỗi xảy ra khi handleSubmit trong NewGroupChatModel", error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            onClick={getFriendList}
            className="flex items-center justify-center transition-all rounded-full cursor-pointer size-5 hover:bg-sidebar-accent"
          >
            <Users className="size-4" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo Nhóm Chat Mới</DialogTitle>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label className="text-sm font-semibold" htmlFor="name">
                  Tên nhóm
                </Label>
                <Input
                  id="name"
                  name="name"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Gõ tên nhóm vào đây..."
                  required={invitedUser.length > 1}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold" htmlFor="search">
                  Mời thành viên
                </Label>
                <Input
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                  id="search"
                  name="search"
                  placeholder="Tìm theo tên hiển thị..."
                />
              </div>

              {searchFriend.length > 0 && (
                <div className="overflow-y-auto border divide-y rounded-lg max-h-45">
                  {searchFriend.map((item) => (
                    <div
                      onClick={() => handleSelectFriend(item)}
                      key={item._id}
                      className="flex items-center gap-3 p-2 transition-all cursor-pointer hover:bg-muted"
                    >
                      <AvatarUser
                        type={"chat"}
                        name={item.displayName}
                        avatarUrl={item.avatarUrl}
                      />
                      <div className="font-semibold">{item.displayName}</div>
                    </div>
                  ))}
                </div>
              )}

              {invitedUser.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {invitedUser.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-muted"
                    >
                      <AvatarUser
                        type={"chat"}
                        name={item.displayName}
                        avatarUrl={item.avatarUrl}
                      />
                      <div className="text-sm">{item.displayName}</div>
                      <X
                        onClick={() => handleRemoveFriend(item)}
                        className="transition-all cursor-pointer size-3 hover:text-destructive"
                      />
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-white transition-all bg-gradient-chat hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <span>Đang tải...</span>
                ) : (
                  <>
                    <UserPlus className="size-4" />
                    Tạo nhóm
                  </>
                )}
              </Button>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewGroupChatModel;
