import { ChevronLeftIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { resetPassword, loading } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = location.state?.resetToken;

  useEffect(() => {
    if (!resetToken) {
      navigate("/forgot-password");
    }

    window.history.replaceState({}, document.title);
  }, [resetToken]);

  if (!resetToken) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 6) {
      return setError("Mật khẩu phải có ít nhất 6 ký tự");
    }

    if (confirmPassword.length < 6) {
      return setError("Mật khẩu xác nhận phải có ít nhất 6 ký tự");
    }

    if (newPassword != confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp");
    }

    try {
      const res = await resetPassword(resetToken, newPassword, confirmPassword);

      if (res.message) {
        navigate("/signin", { replace: true });
        toast.success("Đổi mật khẩu thành công");
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      setTimeout(() => {
        navigate("/forgot-password", { replace: true });
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-purple">
      <Card className="w-full border-none shadow-md sm:max-w-md">
        <CardHeader className="gap-6 text-center">
          <div className="flex items-center justify-center">
            <img
              className="object-contain w-12 h-12"
              src="/logo.png"
              alt="logo"
            />
          </div>

          <div>
            <CardTitle className="text-2xl">Đặt lại mật khẩu</CardTitle>
            <CardDescription className="mt-2 text-base text-gray-600">
              Nhập mật khẩu mới của bạn bên dưới
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-3">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Nhập lại mật khẩu"
              />
              {error && <p className="text-sm text-[#FF0000]">{error}</p>}
            </div>

            <Button
              disabled={!newPassword || !confirmPassword || loading}
              className="w-full"
              type="submit"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </form>

          <Link
            to="/signin"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground group"
          >
            <ChevronLeftIcon className="transition size-4 group-hover:-translate-x-1" />
            <span>Quay lại đăng nhập</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
