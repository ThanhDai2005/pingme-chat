import { useFriendStore } from "@/stores/useFriendStore";
import AvatarUser from "../Chat/UserAvatar";

const SentList = () => {
  const sendList = useFriendStore((state) => state.sendList);

  if (sendList.length == 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bạn chưa gửi lời mời kết bạn nào
      </p>
    );
  }

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
            <div className="text-sm text-muted-foreground">
              Đang chờ trả lời...
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default SentList;
