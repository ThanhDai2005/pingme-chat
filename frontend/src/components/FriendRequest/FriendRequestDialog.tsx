import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useFriendStore } from "@/stores/useFriendStore";
import ReceiveList from "./ReceiveList";
import SentList from "./SentList";

const FriendRequestDialog = ({ open, setOpen }) => {
  const [tab, setTab] = useState("receive");

  const { getFriendRequest } = useFriendStore();

  useEffect(() => {
    const getRequest = async () => {
      try {
        await getFriendRequest();
      } catch (error) {
        console.log("Lỗi xảy ra khi load requests", error);
      }
    };

    getRequest();
  }, []);

  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        <form>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Lời mời kết bạn</DialogTitle>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="receive">Đã nhận</TabsTrigger>
                  <TabsTrigger value="send">Đã gửi</TabsTrigger>
                </TabsList>
                <TabsContent value="receive">
                  <ReceiveList />
                </TabsContent>
                <TabsContent value="send">
                  <SentList />
                </TabsContent>
              </Tabs>
            </DialogHeader>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default FriendRequestDialog;
