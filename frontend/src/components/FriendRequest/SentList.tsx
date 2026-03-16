import { useFriendStore } from "@/stores/useFriendStore";
import AvatarUser from "../Chat/UserAvatar";
import { Button } from "../ui/button";
import { UserX2 } from "lucide-react";

const SentList = () => {
  const sendList = useFriendStore((state) => state.sendList);
  const { loading, cancelFriendRequest } = useFriendStore();
  if (sendList.length == 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào
      </p>
    );
  }

  const handleCancelFriendRequest = async (requestId: string) => {
    try {
      await cancelFriendRequest(requestId);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="mt-4 space-y-3">
        {sendList.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between p-2 border rounded-lg shadow-md border-primary-foreground"
          >
            <div className="flex items-center gap-3">
              <AvatarUser
                type={"sidebar"}
                name={item.to?.displayName}
                avatarUrl={item.to?.avatarUrl}
              />
              <div>
                <h2 className="font-semibold">{item.to?.displayName}</h2>
                <p className="text-sm text-muted-foreground">
                  @{item.to?.username}
                </p>
              </div>
            </div>
            <Button
              onClick={() => handleCancelFriendRequest(item._id)}
              variant={"secondary"}
              disabled={loading}
            >
              <UserX2 />
              Hủy yêu cầu
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default SentList;
