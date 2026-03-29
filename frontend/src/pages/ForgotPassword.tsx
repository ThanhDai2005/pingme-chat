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
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { forgotPasswordLoading, forgotPassword } = useAuthStore();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await forgotPassword(email.toLowerCase());

      if (res.email) {
        navigate("/verify-otp", { state: { email: res.email } });
      }
    } catch (error) {
      setError(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-auto min-h-screen px-4 py-10 overflow-x-hidden sm:px-6 lg:px-8 bg-gradient-purple">
      <Card className="w-full border-none shadow-md z-1 sm:max-w-md">
        <CardHeader className="gap-6">
          <div className="flex items-center justify-center">
            <img
              className="items-center object-contain w-12 h-12"
              src="/logo.png"
              alt="logo"
            />
          </div>

          <div>
            <CardTitle className="mb-1.5 text-2xl">Quên mật khẩu?</CardTitle>
            <CardDescription className="text-base">
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để bạn
              đặt lại mật khẩu.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <Label className="block text-sm" htmlFor="email">
                Email*
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn"
              />
              {error && <p className="text-sm text-[#FF0000]">{error}</p>}
            </div>

            <Button
              disabled={!email.trim() || forgotPasswordLoading}
              className="w-full"
              type="submit"
            >
              {forgotPasswordLoading ? "Đang gửi mã..." : "Tiếp theo"}
            </Button>
          </form>

          <Link
            to="/signin"
            className="flex items-center gap-2 mx-auto group w-fit"
          >
            <ChevronLeftIcon className="size-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Quay lại trang đăng nhập</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
