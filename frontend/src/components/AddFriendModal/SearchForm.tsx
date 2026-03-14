import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

const SearchForm = ({
  handleSearch,
  handleCancel,
  isFound,
  username,
  name,
  setUsername,
  loading,
}) => {
  return (
    <>
      <form onSubmit={handleSearch} className="space-y-2">
        <Label className="text-sm font-semibold" htmlFor="username">
          Tìm bằng username
        </Label>
        <Input
          className="transition-all glass border-border/50 focus:border-primary/50"
          id="username"
          placeholder="Gõ tên username vào đậy..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {isFound == false && (
          <span className="text-sm text-destructive">
            Không tìm thấy
            <span className="font-semibold">@{name}</span>
          </span>
        )}
      </form>
      <DialogFooter>
        <DialogClose asChild>
          <Button
            onClick={handleCancel}
            className="flex-1 hover:text-destructive"
            variant="outline"
          >
            Cancel
          </Button>
        </DialogClose>
        <Button
          className="flex-1 text-white transition-all bg-gradient-chat hover:opacity-90"
          disabled={loading || !username?.trim()}
          type="submit"
          onClick={handleSearch}
        >
          {loading ? (
            <span>Đang tìm...</span>
          ) : (
            <>
              <Search className="mr-2 size-4" />
              Tìm
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default SearchForm;
