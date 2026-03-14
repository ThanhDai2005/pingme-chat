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

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("imgUrl", file);
    try {
      const res = await chatService.uploadImage(formData);

      sendImageMessage(res.imgUrl);
    } catch (error) {
      console.log(error);
    }
  };

  const sendImageMessage = async (imgUrl) => {
    try {
      if (selectedConvo?.type == "direct") {
        const participant = selectedConvo?.participants.find(
          (p) => p.userId._id != user?._id,
        );

        await sendDirectMessage(participant.userId._id, "", imgUrl);
      } else {
        await sendGroupMessage(selectedConvo._id, "", imgUrl);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    }
  };

  const handleEnter = (e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!value.trim()) return;
    const currentValue = value;
    setValue("");
    try {
      if (selectedConvo?.type == "direct") {
        const participant = selectedConvo?.participants.find(
          (p) => p.userId._id != user?._id,
        );
        await sendDirectMessage(participant.userId._id, currentValue);
        setValue("");
      } else {
        await sendGroupMessage(selectedConvo._id, currentValue);
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi xảy ra khi gửi tin nhắn. Bạn hãy thử lại!");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 p-3 min-h-14 bg-background">
        <Button
          onClick={handleClick}
          variant={"ghost"}
          size={"icon"}
          className="transition-all hover:bg-primary/10"
        >
          <ImagePlus className="size-4" />
        </Button>

        <input onChange={handleChange} ref={inputRef} type="file" hidden />
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
          disabled={!value.trim()}
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
