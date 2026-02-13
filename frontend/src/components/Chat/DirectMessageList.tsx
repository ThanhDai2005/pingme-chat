import { useChatStore } from "@/stores/useChatStore";
import DirectMessageCard from "./DirectMessageCard";

const DirectMessageList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return;

  const directMessage = conversations.filter((item) => item.type == "direct");

  return (
    <>
      <div className="p-2 space-y-2 overflow-y-auto">
        {directMessage.map((item) => (
          <DirectMessageCard key={item._id} item={item} />
        ))}
      </div>
    </>
  );
};

export default DirectMessageList;
