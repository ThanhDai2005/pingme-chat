import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { UserPlus } from "lucide-react";
import { useState } from "react";
import SearchForm from "../AddFriendModal/SearchForm";
import SendFriendRequest from "../AddFriendModal/SendFriendRequest";
import { useFriendStore } from "@/stores/useFriendStore";
import { toast } from "sonner";

const AddFriendModal = () => {
  const [isFound, setIsFound] = useState<boolean | null>(null);
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const { loading, searchUser, sendFriendRequest, getFriendRequest } =
    useFriendStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setName(username);

    try {
      const res = await searchUser(username);

      if (res.user) {
        setIsFound(true);
        setUser(res.user);
      } else {
        setIsFound(false);
      }
    } catch (error) {
      console.log(error);
      setIsFound(false);
    }
  };

  const handleSendFriendRequest = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      const res = await sendFriendRequest(user._id, message.trim());

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
    setMessage("");
    setIsFound(null);
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

          {!isFound && (
            <>
              <SearchForm
                handleSearch={handleSearch}
                handleCancel={handleCancel}
                isFound={isFound}
                username={username}
                name={name}
                setUsername={setUsername}
                loading={loading}
              />
            </>
          )}

          {isFound && (
            <>
              <SendFriendRequest
                handleSendFriendRequest={handleSendFriendRequest}
                username={username}
                message={message}
                setMessage={setMessage}
                loading={loading}
                onBack={() => setIsFound(null)}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddFriendModal;
