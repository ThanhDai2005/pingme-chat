import { formatMessageTime } from "@/lib/utils";
import { Card } from "../ui/card";
import AvatarUser from "./UserAvatar";
import { Badge } from "../ui/badge";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import { useEffect, useRef } from "react";

const MessageItem = ({
  mess,
  index,
  messageList,
  selectedConvo,
  lastMessageStatus,
}) => {
  const images = useRef(null);
  const prev =
    index + 1 < messageList.length ? messageList[index + 1] : undefined;

  const chatBreak =
    index == messageList.length - 1 ||
    mess?.senderId != prev?.senderId ||
    new Date(mess?.createdAt).getTime() - new Date(prev?.createdAt).getTime() >
      300000; // tách nhóm tin nhắn khi nằm trong 3 điều kiện trên để thêm lại avatar và time

  const participant = selectedConvo.participants.find(
    (item) => item.userId._id == mess.senderId,
  );

  useEffect(() => {
    let gallery;
    if (images.current) {
      gallery = new Viewer(images.current);
    }

    return () => gallery?.destroy();
  }, [mess.imgUrl]);

  console.log(mess);

  return (
    <>
      <div
        className={`flex gap-2 message-bounce mt-1 ${mess.isOwn ? "justify-end" : "justify-start"}`}
      >
        {!mess.isOwn && ( // chỉ có người khác gửi mới hiện lên avatar
          <div className="w-8">
            {chatBreak && (
              <AvatarUser
                type={"chat"}
                name={participant?.userId.displayName}
                avatarUrl={participant?.userId.avatarUrl ?? null}
              />
            )}
          </div>
        )}
        <div
          className={`max-w-xs lg:max-w-md flex flex-col ${mess.isOwn ? "items-end" : "items-start"}`}
        >
          {mess.content && (
            <Card
              className={`p-3 max-w-fit ${
                mess.isOwn ? "chat-bubble-sent" : "chat-bubble-received"
              }`}
            >
              <p className="text-sm leading-relaxed break-words">
                {mess.content}
              </p>
            </Card>
          )}

          {mess.imgUrl?.length > 0 && (
            <div
              ref={images}
              className={`grid gap-1 mb-2
              ${
                mess.imgUrl.length == 1
                  ? "grid-cols-1"
                  : mess.imgUrl.length <= 4
                    ? "grid-cols-2"
                    : "grid-cols-3"
              }
            `}
            >
              {mess.imgUrl.map((img, index) => (
                <div
                  key={index}
                  className={`overflow-hidden rounded-lg cursor-pointer ${
                    mess.imgUrl.length === 1
                      ? "max-w-[250px] sm:max-w-[400px]"
                      : "aspect-square max-w-[100px] sm:max-w-[180px] "
                  }`}
                >
                  <img
                    src={img}
                    className="object-cover w-full h-full transition hover:opacity-90"
                  />
                </div>
              ))}
            </div>
          )}

          {/* sent / seen */}
          {mess.isOwn && mess._id == selectedConvo?.lastMessage?.messageId && (
            <Badge
              variant="outline"
              className={`mt-1 leading-none text-xs px-1.5 py-0.5 h-4 border-0 ${lastMessageStatus == "seen" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
            >
              {lastMessageStatus}
            </Badge>
          )}
        </div>
      </div>
      {chatBreak && (
        <span className="flex justify-center px-1 text-xs text-muted-foreground">
          {formatMessageTime(new Date(mess.createdAt))}
        </span>
      )}
    </>
  );
};

export default MessageItem;
