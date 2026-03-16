import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { Textarea } from "../ui/textarea";

const SendFriendRequest = ({
  handleSendFriendRequest,
  username,
  message,
  setMessage,
  loading,
  onBack,
}) => {
  return (
    <>
      <form onSubmit={handleSendFriendRequest} className="space-y-2">
        <div className="text-sm text-emerald-500">
          Tìm thấy <span className="font-semibold">@{username}</span> rồi nè🎉
        </div>
        <Label className="text-sm font-semibold" htmlFor="message">
          Giới thiệu
        </Label>
        <Textarea
          className="transition-all resize-none glass border-border/50 focus:border-primary/50"
          id="message"
          rows={3}
          value={message}
          placeholder={"Chào bạn - Có thể kết bạn được không?..."}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            className="flex-1 bg-muted/50 hover:bg-muted dark:bg-muted/40 dark:hover:bg-muted/60"
            variant="outline"
            onClick={onBack}
          >
            Quay lại
          </Button>
        </DialogClose>
        <Button
          className="flex-1 text-white transition-all bg-gradient-chat hover:opacity-90"
          disabled={loading}
          type="submit"
          onClick={handleSendFriendRequest}
        >
          {loading ? (
            <span>Đang gửi...</span>
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Kết bạn
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default SendFriendRequest;
