import { useFriendStore } from "@/stores/useFriendStore";
import AvatarUser from "../Chat/UserAvatar";
import { Button } from "../ui/button";
import { toast } from "sonner";

const ReceiveList = () => {
  const receiveList = useFriendStore((state) => state.receiveList);
  const { acceptFriendRequest, declineFriendRequest, loading } =
    useFriendStore();

  if (receiveList.length == 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa có lời mời kết bạn nào
      </p>
    );
  }

  const handleAccept = async (requestId: string) => {
    try {
      await acceptFriendRequest(requestId);
      toast.success("Đã đồng ý kết bạn thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await declineFriendRequest(requestId);
      toast.info("Đã từ chối kết bạn ");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mt-4 space-y-3">
        {receiveList.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-2 border rounded-lg shadow-md border-primary-foreground"
          >
            <div className="flex items-center gap-3">
              <AvatarUser
                type={"sidebar"}
                name={item.from?.displayName}
                avatarUrl={item.from?.avatarUrl}
              />
              <div>
                <h2 className="font-semibold">{item.from?.displayName}</h2>
                <p className="text-sm text-muted-foreground">
                  @{item.from?.username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleAccept(item._id)}
                size={"sm"}
                variant={"primary"}
                disabled={loading}
              >
                Chấp nhận
              </Button>
              <Button
                onClick={() => handleDecline(item._id)}
                size={"sm"}
                variant={"destructiveOutline"}
                disabled={loading}
              >
                Từ chối
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReceiveList;
