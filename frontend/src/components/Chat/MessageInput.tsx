import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send, Smile } from "lucide-react";
import { Input } from "../ui/input";
import EmojiPicker from "emoji-picker-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { toast } from "sonner";
import { chatService } from "@/services/chatService";

const MessageInput = ({ selectedConvo }) => {
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const user = useAuthStore((state) => state.user);

  const [value, setValue] = useState("");
  const isDark = useThemeStore((state) => state.isDark);
  const [openEmoji, setOpenEmoji] = useState(false);
  const inputRef = useRef(null);
  const [imagesPreview, setImagesPreview] = useState([]);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length == 0) return;

    const preview = files.map((file) => ({
      file: file,
      url: URL.createObjectURL(file), // tạo ra đường dẫn ảnh hiển thị ra tạm thời
    }));
    setImagesPreview([...imagesPreview, ...preview]);
  };

  const handleFilter = (url) => {
    setImagesPreview(imagesPreview.filter((item) => item.url != url));
  };

  const handleEnter = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!value.trim() && imagesPreview.length == 0) return;
    const currentValue = value;
    setValue("");
    try {
      let url = [];

      if (imagesPreview.length > 0) {
        const formData = new FormData();
        imagesPreview.map((img) => formData.append("imgUrl", img.file));

        const res = await chatService.uploadImage(formData);

        url = res?.imgUrl.map((item) => item.url); // [{url: "..."},{url: "..."},{url: "..."}] => [url, url, url]
      }

      if (selectedConvo?.type == "direct") {
        const participant = selectedConvo?.participants.find(
          (p) => p.userId._id != user?._id,
        );
        await sendDirectMessage(participant.userId._id, currentValue, url);
        setValue("");
        setImagesPreview([]);
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue, url);
        setValue("");
        setImagesPreview([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    }
  };

  return (
    <>
      {imagesPreview.length > 0 && (
        <div className="flex gap-2 px-3 pt-2 overflow-x-auto">
          {imagesPreview.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img.url}
                className="object-cover w-20 h-20 rounded-lg"
              />

              <button
                onClick={() => handleFilter(img.url)}
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
            className="pr-20 transition-all bg-white border h-9 border-border/50 focus:border-primary/50"
            onKeyDown={handleEnter}
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
          disabled={!value.trim() && imagesPreview.length == 0}
          className="transition-all bg-gradient-chat hover:shadow-glow hover:scale-105"
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
