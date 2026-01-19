import LogOut from "@/components/auth/LogOut";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const ChatAppPage = () => {
  const user = useAuthStore((store) => store.user);

  const handleClick = async () => {
    try {
      await api.get("/user/test", { withCredentials: true });
      toast.success("thành công");
    } catch (error) {
      console.log(error);
      toast.error("thất bại");
    }
  };

  return (
    <>
      {user?.username}
      <div>ChatAppPage</div>
      <LogOut />
      <Button onClick={handleClick}>Test</Button>
    </>
  );
};

export default ChatAppPage;
