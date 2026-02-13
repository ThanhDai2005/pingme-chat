import { formatMessageTime } from "@/lib/utils";
import { Card } from "../ui/card";
import AvatarUser from "./UserAvatar";
import { Badge } from "../ui/badge";

const MessageItem = ({
  mess,
  index,
  messageList,
  selectedConvo,
  lastMessageStatus,
}) => {
  const prev = messageList[index - 1];

  const chatBreak =
    index == 0 ||
    mess?.senderId != prev?.senderId ||
    new Date(mess?.createdAt).getTime() - new Date(prev?.createdAt).getTime() >
      300000; // tách nhóm tin nhắn khi nằm trong 3 điều kiện trên để thêm lại avatar và time

  const participant = selectedConvo.participants.find(
    (item) => item.userId._id == mess.senderId,
  );

  return (
    <>
      {chatBreak && (
        <span className="flex justify-center px-1 text-xs text-muted-foreground">
          {formatMessageTime(new Date(mess.createdAt))}
        </span>
      )}
      <div
        className={`flex gap-2 message-bounce mt-1 ${mess.isOwn ? "justify-end" : "justify-start"}`}
      >
        {!mess.isOwn && ( // chỉ có người khác gửi mới hiện lên avatar
          <div className="w-8">
            {chatBreak && (
              <AvatarUser
                type={"chat"}
                name={participant.userId.displayName}
                avatarUrl={participant.userId.avatarUrl ?? null}
              />
            )}
          </div>
        )}
        <div className="max-w-xs lg:max-w-md">
          <Card
            className={`p-3 ${mess.isOwn ? "chat-bubble-sent" : "chat-bubble-received"}`}
          >
            <p className="text-sm leading-relaxed wrap-break-word">
              {mess.content}
            </p>
          </Card>

          {/* sent / seen */}
          {mess.isOwn && mess._id == selectedConvo?.lastMessage?.messageId && (
            <Badge
              variant="outline"
              className={`text-xs px-1.5 py-0.5 h-4 border-0 ${lastMessageStatus == "seen" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              {lastMessageStatus}
            </Badge>
          )}
        </div>
      </div>
    </>
  );
};

export default MessageItem;
