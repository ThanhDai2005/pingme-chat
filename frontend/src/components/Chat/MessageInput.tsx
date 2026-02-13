import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useState } from "react";
import { Button } from "../ui/button";
import { ImagePlus, Send, Smile } from "lucide-react";
import { Input } from "../ui/input";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useThemeStore } from "@/stores/useThemeStore";
import { toast } from "sonner";

const MessageInput = ({ selectedConvo }) => {
  const { sendDirectMessage, sendGroupMessage } = useChatStore();
  const user = useAuthStore((state) => state.user);

  const [value, setValue] = useState("");
  const isDark = useThemeStore((state) => state.isDark);
  const [openEmoji, setOpenEmoji] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setValue((prev) => prev + emoji.native);
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
          variant={"ghost"}
          size={"icon"}
          className="transition-all hover:bg-primary/10"
        >
          <ImagePlus className="size-4" />
        </Button>
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
          <div className="absolute z-50 overflow-hidden shadow-xl bottom-16 right-4 max-h-80 rounded-xl">
            <Picker
              data={data}
              onEmojiSelect={handleEmojiSelect}
              theme={isDark ? "dark" : "light"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default MessageInput;
