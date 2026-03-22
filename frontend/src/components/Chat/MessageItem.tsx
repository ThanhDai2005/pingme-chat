import { formatMessageTime } from "@/lib/utils";
import { Card } from "../ui/card";
import AvatarUser from "./UserAvatar";
import { Badge } from "../ui/badge";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import { useEffect, useRef } from "react";
import { Download, FileText, Play } from "lucide-react";

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

  const handleDownload = async (item) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = item.name || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.log("Lỗi tải file", error);
    }
  };

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
            <>
              {mess.imgUrl.filter((item) => item.fileType == "image").length >
                0 && (
                <div
                  ref={images}
                  className={`grid gap-1 mb-2
                  ${
                    mess.imgUrl.filter((item) => item.fileType === "image")
                      .length == 1
                      ? "grid-cols-1"
                      : mess.imgUrl.filter((item) => item.fileType == "image")
                            .length <= 4
                        ? "grid-cols-2"
                        : "grid-cols-3"
                  }`}
                >
                  {mess.imgUrl
                    .filter((item) => item.fileType == "image")
                    .map((item, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-lg cursor-pointer"
                      >
                        <img
                          src={item.url}
                          className="object-cover w-full h-full transition hover:opacity-90"
                        />
                      </div>
                    ))}
                </div>
              )}

              <div className="flex flex-col gap-1 ">
                {mess.imgUrl
                  .filter((item) => item.fileType != "image")
                  .map((item, index) => (
                    <div key={index}>
                      {/* VIDEO */}
                      {item.fileType == "video" && (
                        <div className="overflow-hidden rounded-2xl max-w-[250px] mt-1">
                          <video
                            src={item.url}
                            controls
                            className="w-full h-auto max-h-[300px]"
                          />
                        </div>
                      )}

                      {item.fileType == "file" && (
                        <div className="flex items-center gap-3 px-3 py-2 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-xl max-w-[280px] shadow-sm mt-1">
                          <div className="flex items-center justify-center bg-white rounded-full shadow-sm size-10 shrink-0">
                            <FileText className="text-black size-5" />
                          </div>

                          <div className="flex-1 text-sm font-medium break-words line-clamp-3">
                            {item.name}
                          </div>

                          <button
                            onClick={() => handleDownload(item)}
                            className="p-2 ml-2 transition-all rounded-full hover:bg-white/50"
                          >
                            <Download className="text-gray-600 size-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
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
