import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import SearchForm from "../AddFriendModal/SearchForm";
import SendFriendRequest from "../AddFriendModal/SendFriendRequest";
import { useFriendStore } from "@/stores/useFriendStore";
import { toast } from "sonner";

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState([]);
  const [selectUser, setSelectUser] = useState(null);
  const [message, setMessage] = useState("");
  const { loading, searchUser, sendFriendRequest, getFriendRequest } =
    useFriendStore();

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!username.trim()) {
        setIsFound(null);
        return;
      }

      try {
        const res = await searchUser(username.trim());

        if (res.user.length > 0) {
          setIsFound(true);
          setUser(res.user);
        } else {
          setIsFound(false);
        }
      } catch (error) {
        console.log(error);
        setIsFound(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [username]);

  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
    if (!selectUser) return;

    try {
      const res = await sendFriendRequest(selectUser._id, message.trim());

      if (res.request) {
        toast.success(res.message);
        await getFriendRequest();
      }

      handleCancel();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
    }
  };

  const handleCancel = () => {
    setUsername("");
    setUser([]);
    setIsFound(null);
    setSelectUser(null);
    setMessage("");
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="z-10 flex items-center justify-center rounded-full cursor-pointer size-5 hover:bg-sidebar-accent">
            <UserPlus className="size-4" />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kết bạn</DialogTitle>
          </DialogHeader>

          {!selectUser && (
            <>
              <SearchForm
                username={username}
                setUsername={setUsername}
                loading={loading}
                isFound={isFound}
                user={user}
                setSelectUser={setSelectUser}
                handleCancel={handleCancel}
              />
            </>
          )}

          {selectUser && (
            <>
              <SendFriendRequest
                selectUser={selectUser}
                message={message}
                setMessage={setMessage}
                handleSendFriendRequest={handleSendFriendRequest}
                loading={loading}
                onBack={() => setSelectUser(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddFriendModal;
