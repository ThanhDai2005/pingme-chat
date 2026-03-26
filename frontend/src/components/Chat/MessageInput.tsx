import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { FileText, ImagePlus, Play, Send, Smile } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "emoji-picker-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { toast } from "sonner";
import { chatService } from "@/services/chatService";

const MessageInput = ({ selectedConvo }) => {
  const {
    sendDirectMessage,
    sendGroupMessage,
    imagesPreview,
    addImagesPreview,
    filterImagesPreview,
    clearImagesPreview,
  } = useChatStore();
  const user = useAuthStore((state) => state.user);

  const [value, setValue] = useState("");
  const isDark = useThemeStore((state) => state.isDark);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length == 0) return;

    const preview = files.map((file) => {
      let fileType = "file";

      if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (file.type.startsWith("video/")) {
        fileType = "video";
      }
      return {
        file: file,
        url: URL.createObjectURL(file), // tạo ra đường dẫn ảnh hiển thị ra tạm thời
        fileType: fileType,
        name: file.name,
      };
    });
    addImagesPreview(preview);
    e.target.value = null; // để chọn lại được ảnh vừa xóa
  };

  const handlePaste = (e) => {
    const files = Array.from(e.clipboardData.items);
    if (files.length == 0) return;

    const preview = files.map((item) => {
      const file = item.getAsFile();
      let fileType = "file";

      if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (file.type.startsWith("video/")) {
        fileType = "video";
      }
      return {
        file: file,
        url: URL.createObjectURL(file),
        fileType: fileType,
        name: file.name,
      };
    });

    addImagesPreview(preview);
  };

  const handleFilter = (url) => {
    filterImagesPreview(url);
    URL.revokeObjectURL(url); // Giải phóng bộ nhớ
  };

  const handleEnter = (e) => {
    if (e.key == "Enter" && sending == false) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (sending) return;
    if (!value.trim() && imagesPreview.length == 0) return;

    setSending(true);

    const currentValue = value;
    setValue("");
    try {
      let url = [];

      if (imagesPreview.length > 0) {
        const formData = new FormData();
        imagesPreview.map((img) => formData.append("imgUrl", img.file));

        const res = await chatService.uploadImage(formData);

        url = res?.imgUrl.map((item) => item); // [{url: "..."},{url: "..."},{url: "..."}] => [url, url, url]
      }

      if (selectedConvo?.type == "direct") {
        const participant = selectedConvo?.participants.find(
          (p) => p.userId._id != user?._id,
        );
        await sendDirectMessage(participant.userId._id, currentValue, url);
        setValue("");
        imagesPreview.map((img) => URL.revokeObjectURL(img.url)); // Giải phóng bộ nhớ
        clearImagesPreview();
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue, url);
        setValue("");
        imagesPreview.map((img) => URL.revokeObjectURL(img.url));
        clearImagesPreview();
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    } finally {
      setSending(false); // 🔓 unlock
    }
  };

  return (
    <>
      {imagesPreview.length > 0 && (
        <div className="flex gap-2 px-3 pt-2 overflow-x-auto">
          {imagesPreview.map((item, index) => (
            <div key={index} className="relative">
              {item.fileType == "image" && (
                <img
                  src={item.url}
                  className="object-cover w-20 h-20 rounded-lg"
                />
              )}

              {item.fileType == "video" && (
                <div className="relative">
                  <video
                    src={item.url}
                    className="object-cover w-20 h-20 rounded-lg"
                  />
                  <div className="absolute p-3 -translate-y-1/2 rounded-full bg-black/40 right-5 top-1/2">
                    <Play className="text-white size-4" />
                  </div>
                </div>
              )}

              {item.fileType == "file" && (
                <div className="flex items-center gap-2 px-2 py-1 bg-[#E4E6EB] dark:bg-[#3A3B3C] rounded-xl max-w-[180px] min-h-[56px] shadow-sm">
                  <div className="flex items-center justify-center bg-white rounded-full shadow-sm size-8 shrink-0">
                    <FileText className="text-black size-4" />
                  </div>

                  <div className="text-sm font-medium leading-[1.2] break-words line-clamp-2">
                    {item.name}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleFilter(item.url)}
                className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-black rounded-full -top-2 -right-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2 p-3 min-h-14 bg-background">
        <Button
          onClick={handleClick}
          variant={"ghost"}
          size={"icon"}
          className="transition-all hover:bg-primary/10 hover:text-black dark:hover:text-white"
        >
          <ImagePlus className="size-4" />
        </Button>

        <input
          multiple
          onChange={handleChange}
          ref={inputRef}
          type="file"
          hidden
        />
        <div className="relative flex-1">
          <Input
            placeholder="Soạn tin nhắn ..."
            name="content"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPaste={handlePaste}
            onKeyDown={handleEnter}
            className="pr-20 transition-all bg-white border h-9 border-border/50 focus:border-primary/50"
          />
          <div className="absolute flex items-center gap-1 -translate-y-1/2 top-1/2 right-2">
            <Button
              className="transition-all size-8 hover:bg-primary/10"
              variant={"ghost"}
              size={"icon"}
              onClick={() => setOpenEmoji(!openEmoji)}
            >
              <Smile className="size-4" />
            </Button>
          </div>
        </div>
        <Button
          disabled={sending}
          className={`transition-all bg-gradient-chat hover:shadow-glow hover:scale-105 ${sending && "opacity-60"}`}
          onClick={sendMessage}
        >
          <Send className="text-white size-4" />
        </Button>
        {openEmoji && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpenEmoji(false)}
            />
            <div className="absolute z-50 overflow-hidden shadow-xl bottom-16 right-4 max-h-80 rounded-xl">
              <EmojiPicker
                onEmojiClick={(emojiData) => {
                  setValue((prev) => prev + emojiData.emoji);
                }}
                theme={isDark ? "dark" : "light"}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MessageInput;
