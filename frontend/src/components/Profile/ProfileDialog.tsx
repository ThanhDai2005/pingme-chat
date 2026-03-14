import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/useAuthStore";
import ProfileCard from "./ProfileCard";
import { useState } from "react";
import Personal from "./Personal";
import Preferences from "./Preferences";
import Privacy from "./Privacy";

const ProfileDialog = ({ open, setOpen }) => {
  const user = useAuthStore((state) => state.user);
  const [tab, setTab] = useState("personal");

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <form>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Profile & Settings
              </DialogTitle>
            </DialogHeader>

            <ProfileCard user={user} />
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full">
                <TabsTrigger value="personal">Tài Khoản</TabsTrigger>
                <TabsTrigger value="preferences">Cấu hình</TabsTrigger>
                <TabsTrigger value="privacy">Bảo mật</TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <Personal user={user} />
              </TabsContent>
              <TabsContent value="preferences">
                <Preferences user={user} />
              </TabsContent>
              <TabsContent value="privacy">
                <Privacy />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </form>
      </Dialog>
    </>
  );
};

export default ProfileDialog;
