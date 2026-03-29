import { ChevronLeftIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const { loading, forgotPasswordLoading, verifyOtp, forgotPassword } =
    useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleForgotPassword = async (email) => {
    if (cooldown > 0) return;

    toast.promise(forgotPassword(email), {
      loading: "Đang gửi lại mã OTP...",
      success: "Đã gửi lại mã OTP thành công!",
      error: (err) => err?.response?.data?.message || "Gửi lại OTP thất bại!",
    });

    setCooldown(30);
  };

  // verify OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await verifyOtp(email, otp);

      if (res.resetToken) {
        navigate("/reset-password", {
          state: { resetToken: res.resetToken },
          replace: true,
        });
      }
    } catch (error) {
      setError(error?.response?.data?.message);
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
            <CardTitle className="text-2xl">Xác thực email</CardTitle>
            <CardDescription className="mt-2 text-base text-gray-600">
              Mã xác nhận đã được gửi tới <br />
              <span className="font-semibold text-foreground">{email}</span>
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center gap-4">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e)}
                pattern={REGEXP_ONLY_DIGITS}
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="w-12 h-12 text-lg border-gray-300 rounded-md"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button
              disabled={otp.length !== 6 || loading}
              className="w-full"
              type="submit"
            >
              {loading ? "Đang xác thực..." : "Tiếp tục"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-500">
            Chưa nhận được mã?{" "}
            <button
              disabled={forgotPasswordLoading || cooldown > 0}
              onClick={() => handleForgotPassword(email)}
              className="inline-flex items-center gap-1 font-semibold text-[#2B7FFF] hover:underline disabled:opacity-50"
            >
              {cooldown > 0
                ? `Gửi lại (${cooldown}s)`
                : forgotPasswordLoading
                  ? "Đang gửi..."
                  : "Gửi lại"}
            </button>
          </p>

          <Link
            to="/forgot-password"
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground group"
          >
            <ChevronLeftIcon className="transition size-4 group-hover:-translate-x-1" />
            <span>Quay lại</span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyOtp;
