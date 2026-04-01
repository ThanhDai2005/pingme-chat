import { formatMessageTime } from "@/lib/utils";
import { Card } from "../ui/card";
import AvatarUser from "./UserAvatar";
import { Badge } from "../ui/badge";
import Viewer from "viewerjs";
import "viewerjs/dist/viewer.css";
import { useEffect, useRef, useState } from "react";
import { Download, FileText, MoreVertical, Send, Smile } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { useChatStore } from "@/stores/useChatStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/stores/useAuthStore";

const MessageItem = ({
  mess,
  index,
  messageList,
  selectedConvo,
  lastMessageStatus,
}) => {
  const { user } = useAuthStore();
  const { updateMessage, deleteMessage } = useChatStore();

  const [editingId, setEditingId] = useState(null);
  const [content, setContent] = useState("");

  const checkTimeEdit =
    new Date().getTime() - new Date(mess.createdAt).getTime() <= 600000;

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

  const handleUpdateMessage = async (messageId) => {
    try {
      await updateMessage(messageId, content);

      setEditingId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnter = (e) => {
    if (e.key == "Enter") {
      handleUpdateMessage(mess._id);
    }

    if (e.key == "Escape") setEditingId(null);
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.log(error);
    }
  };

  const contentDelete =
    mess.senderId == user?._id
      ? "Bạn đã xóa một tin nhắn"
      : `${participant?.userId.displayName} đã xóa một tin nhắn`;

  return (
    <>
      <AlertDialog>
        <div
          className={`flex gap-2 message-bounce my-1 ${mess.isOwn ? "justify-end" : "justify-start"}`}
        >
          {!mess.isOwn && (
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
            {mess.isEdit && (
              <span className="mb-1 mx-1 text-xs text-[#4E4BF5] hover:underline font-medium">
                Đã chỉnh sửa
              </span>
            )}

            <div className="flex items-end gap-3 group">
              {mess.isOwn && mess.isDelete == false && (
                <div className="flex items-center gap-1 transition-all opacity-0 group-hover:opacity-100">
                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <div className="size-6 bg-[#F2F2F2] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                            <MoreVertical className="size-4" />
                          </div>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>

                      <TooltipContent>Xem thêm</TooltipContent>
                    </Tooltip>

                    <DropdownMenuContent side="top">
                      <DropdownMenuGroup>
                        {mess.content &&
                          checkTimeEdit &&
                          mess.imgUrl.length == 0 && (
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingId(mess._id);
                                setContent(mess.content);
                              }}
                            >
                              Chỉnh sửa
                            </DropdownMenuItem>
                          )}
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem>Thu hồi</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <DropdownMenuItem>Chuyển tiếp</DropdownMenuItem>
                        <DropdownMenuItem>Ghim</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <AlertDialogContent>
                    <AlertDialogHeader className="border-b border-b-[#E5E5E5]">
                      <AlertDialogTitle className="w-full text-xl font-bold text-center">
                        Thu hồi tin nhắn?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div>
                      <AlertDialogDescription className="text-[15px] text-[#1E293B]">
                        Tin nhắn này sẽ bị thu hồi và không còn hiển thị trong
                        cuộc trò chuyện.
                      </AlertDialogDescription>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-0 text-[#0064FF] rounded-sm font-semibold hover:!bg-[#F2F2F2] hover:!text-[#0064FF] cursor-pointer">
                        Hủy
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(mess._id)}
                        className="bg-[#0064FF] hover:bg-[#0057DE] rounded-sm font-semibold w-15 cursor-pointer"
                      >
                        Gỡ
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="size-6 bg-[#F2F2F2] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200">
                        <Smile className="size-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Bày tỏ cảm xúc</TooltipContent>
                  </Tooltip>
                </div>
              )}

              <div
                className={`flex flex-col ${mess.isOwn ? "items-end" : "items-start"} max-w-full`}
              >
                {mess.isDelete ? (
                  <>
                    <Card className="p-3 bg-white border max-w-fit ">
                      <p className="text-sm text-[#65686C] italic leading-relaxed break-words">
                        {contentDelete}
                      </p>
                    </Card>
                  </>
                ) : (
                  <>
                    {mess.content && (
                      <Card
                        className={`p-3 max-w-fit ${
                          mess.isOwn
                            ? "chat-bubble-sent"
                            : "chat-bubble-received"
                        }`}
                      >
                        {editingId == mess._id ? (
                          <div className="flex items-center justify-between gap-1">
                            <input
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              onKeyDown={handleEnter}
                              className="px-2 py-1 text-sm border rounded"
                            />

                            <Button
                              disabled={content == mess.content}
                              onClick={() => handleUpdateMessage(mess._id)}
                            >
                              <Send className="text-white size-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setEditingId(null)}
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <p className="text-sm leading-relaxed break-words">
                            {mess.content}
                          </p>
                        )}
                      </Card>
                    )}

                    {mess.imgUrl?.length > 0 && (
                      <>
                        {mess.imgUrl.filter((item) => item.fileType == "image")
                          .length > 0 && (
                          <div
                            ref={images}
                            className={`grid gap-1 my-1
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
                                  className="my-1 overflow-hidden rounded-lg cursor-pointer"
                                >
                                  <img
                                    src={item.url}
                                    className="object-cover w-full h-full transition hover:opacity-90"
                                  />
                                </div>
                              ))}
                          </div>
                        )}

                        {mess.imgUrl.filter((item) => item.fileType != "image")
                          .length > 0 && (
                          <div className="flex flex-col gap-1 my-1">
                            {mess.imgUrl
                              .filter((item) => item.fileType != "image")
                              .map((item, index) => (
                                <div key={index}>
                                  {item.fileType == "video" && (
                                    <div className="overflow-hidden rounded-2xl max-w-[250px] shadow-sm dark:shadow-2xl">
                                      <video
                                        src={item.url}
                                        controls
                                        className="w-full h-auto max-h-[300px]"
                                      />
                                    </div>
                                  )}

                                  {item.fileType == "file" && (
                                    <div className="flex items-center gap-3 px-3 py-2 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-xl max-w-[280px] shadow-sm">
                                      <div className="flex items-center justify-center bg-white rounded-full shadow-sm size-10 shrink-0">
                                        <FileText className="text-black size-5" />
                                      </div>

                                      <div className="flex-1 text-sm font-medium break-words line-clamp-3">
                                        {item.name}
                                      </div>

                                      <button
                                        onClick={() => handleDownload(item)}
                                        className="p-2 ml-2 transition-all rounded-full hover:bg-white/50 "
                                      >
                                        <Download className="text-gray-600 dark:text-current size-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {mess.isOwn &&
              mess._id == selectedConvo?.lastMessage?.messageId && (
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
      </AlertDialog>
    </>
  );
};

export default MessageItem;
