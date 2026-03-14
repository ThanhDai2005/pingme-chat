import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell, Shield, ShieldBan } from "lucide-react";
import { Button } from "../ui/button";

const Privacy = () => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5 text-primary" /> Quyền riêng tư & Bảo mật
          </CardTitle>
          <CardDescription>
            Quản lý cài đặt quyền riêng tư và bảo mật của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Button
              variant={"outline"}
              className="flex items-center justify-start w-full hover:text-warning"
            >
              <Shield className="size-4" />
              Đổi mật khẩu
            </Button>
            <Button
              variant={"outline"}
              className="flex items-center justify-start w-full dark:hover:text-info hover:text-blue-800"
            >
              <Bell className="size-4" />
              Cài đặt thông báo
            </Button>
            <Button
              variant={"outline"}
              className="flex items-center justify-start w-full hover:text-destructive"
            >
              <ShieldBan className="size-4" />
              Chặn & báo cáo
            </Button>
          </div>

          <div className="pt-3 space-y-3">
            <div className="font-semibold text-destructive">
              Khu vực nguy hiểm
            </div>
            <Button variant={"destructive"} className="w-full">
              Xóa tài khoản
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Privacy;
