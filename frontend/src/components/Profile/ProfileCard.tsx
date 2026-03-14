import { Camera } from "lucide-react";
import AvatarUser from "../Chat/UserAvatar";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { useSocketStore } from "@/stores/useSocketStore";
import { useRef } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ProfileCard = ({ user }) => {
  const { onlineUsers } = useSocketStore();

  if (!user.bio) {
    user.bio = "living life to the fullest";
  }
  const fileInputRef = useRef(null);
  const { uploadAvatar } = useUserStore();

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    toast.promise(uploadAvatar(formData), {
      loading: "Đang tải ảnh lên...",
      success: "Cập nhật avatar mới thành công!",
      error: "Không thể cập nhật ảnh, vui lòng thử lại!",
    });
  };

  return (
    <>
      <Card className="p-0 overflow-hidden bg-gradient-to-r from-indigo-500 to-blue-600 dark:from-[#0d1a36] dark:to-[#1e3a8a] min-h-50">
        <CardContent className="flex flex-col items-center gap-4 pb-6 mt-10 sm:flex-row sm:items-end sm:mt-20">
          <div className="relative">
            <AvatarUser
              type={"profile"}
              name={user.displayName}
              avatarUrl={user.avatarUrl}
            />
            <Button
              onClick={handleClick}
              size={"icon"}
              variant={"secondary"}
              className="absolute flex items-center justify-center text-black transition-all duration-300 bg-white rounded-full shadow-md size-9 hover:scale-115 hover:bg-background ring-2 ring-indigo-600 dark:hover:text-white dark:ring-blue-500 -bottom-2 -right-2"
            >
              <Camera className="size-4" />
            </Button>

            <input
              type="file"
              name="avatar"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleUploadAvatar}
            />
          </div>
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {user.displayName}
            </h2>
            <p className="max-w-lg text-sm text-white/70 line-clamp-2">
              {user.bio}
            </p>
          </div>

          <Badge
            className={`${onlineUsers.includes(user._id) ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"} flex items-center gap-1`}
          >
            <div
              className={`rounded-full size-2 ${onlineUsers.includes(user._id) ? "bg-green-500 animate-pulse" : "bg-slate-500"}`}
            ></div>
            {onlineUsers.includes(user._id) ? "Online" : "Offline"}
          </Badge>
        </CardContent>
      </Card>
    </>
  );
};

export default ProfileCard;
