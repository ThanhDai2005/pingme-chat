import { useChatStore } from "@/stores/useChatStore";
import GroupChatCard from "./GroupChatCard";

export const GroupChatList = () => {
  const { conversations } = useChatStore();

  const GroupChat = conversations.filter((item) => item.type == "group");

  return (
    <>
      <div className="p-2 space-y-2 overflow-y-auto">
        {GroupChat.map((item) => (
          <GroupChatCard key={item._id} item={item} />
        ))}
      </div>
    </>
  );
};

export default GroupChatList;
