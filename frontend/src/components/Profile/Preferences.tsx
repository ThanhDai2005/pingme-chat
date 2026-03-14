import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Moon, Sun } from "lucide-react";
import { Switch } from "../ui/switch";
import { useThemeStore } from "@/stores/useThemeStore";
import { useSocketStore } from "@/stores/useSocketStore";

const Preferences = ({ user }) => {
  const { toggleTheme, isDark } = useThemeStore();
  const { disconnectSocket, connectSocket, onlineUsers, setOnlineUsers } =
    useSocketStore();

  const handleChangeStatus = (e) => {
    if (e == false) {
      setOnlineUsers(onlineUsers.filter((item) => item != user._id));
    } else {
      setOnlineUsers([...onlineUsers, user._id]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="size-5 text-primary" />
            Tùy chỉnh ứng dụng
          </CardTitle>
          <CardDescription>
            Cá nhân hóa trò chuyện trải nghiệm của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Chế dộ tối</div>
              <p className="text-sm text-muted-foreground">
                Chuyển đổi giữa giao diện sáng và tối
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="size-4" />
              <Switch
                className="data-[state=checked]:bg-primary-glow"
                checked={isDark}
                onCheckedChange={toggleTheme}
              />
              <Moon className="size-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">Hiển thị trạng thái online</div>
              <p className="text-sm text-muted-foreground">
                Cho phép người khác thấy khi bạn đang online
              </p>
            </div>

            <Switch defaultChecked onCheckedChange={handleChangeStatus} />
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Preferences;
