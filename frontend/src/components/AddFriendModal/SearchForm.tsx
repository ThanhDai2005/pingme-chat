import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AvatarUser from "../Chat/UserAvatar";
import { Loader2 } from "lucide-react";

const SearchForm = ({
  username,
  setUsername,
  loading,
  isFound,
  user,
  setSelectUser,
  handleCancel,
}) => {
  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <Label className="text-sm font-semibold" htmlFor="username">
          Tìm kiếm người dùng
        </Label>
        <Input
          className="transition-all glass border-border/50 focus:border-primary/50"
          id="username"
          placeholder="Nhập tên hoặc username để tìm..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="relative">
          {isFound == true && (
            <div className="mt-2 overflow-y-auto border divide-y rounded-lg shadow-sm max-h-52 bg-popover">
              {user.map((item) => (
                <div
                  onClick={() => setSelectUser(item)}
                  key={item._id}
                  className="flex items-center gap-3 p-3 transition-all cursor-pointer hover:bg-muted/50"
                >
                  <AvatarUser
                    type={"chat"}
                    name={item.displayName}
                    avatarUrl={item.avatarUrl}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      @{item.username}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/70 backdrop-blur-sm">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
        </div>

        {isFound == false && (
          <span className="text-sm text-destructive">
            Không tìm thấy
            <span className="font-semibold">@{username}</span>
          </span>
        )}
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={handleCancel}
            className="flex-1 bg-muted/50 hover:bg-muted dark:hover:bg-popover/60 dark:bg-popover"
            variant="outline"
          >
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
};

export default SearchForm;
