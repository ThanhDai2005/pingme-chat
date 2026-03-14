import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/stores/useUserStore";
import { toast } from "sonner";

const updateProfile = z.object({
  displayName: z.string().min(3, "Tên hiển thị phải có trên 3 ký tự"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^(0)\d{9,10}$/.test(val), {
      message: "Định dạng số điện thoại không hợp lệ (0...)",
    }),
  bio: z.string().optional(),
});

type UpdateProfileForm = z.infer<typeof updateProfile>;

const Personal = ({ user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfile),
    defaultValues: {
      displayName: user?.displayName || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      bio: user?.bio || "",
    },
  });

  const { updateInfo } = useUserStore();

  const onsubmit = async (data: UpdateProfileForm) => {
    console.log(data);
    try {
      const { displayName, username, email, phone, bio } = data;

      await updateInfo(displayName, username, email, phone || "", bio || "");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="size-5 text-primary" /> Thông tin cá nhân
          </CardTitle>
          <CardDescription>
            Cập nhật chi tiết cá nhân và thông tin hồ sơ của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-sm font-semibold">
                  Tên hiển thị
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  {...register("displayName")}
                />
                {errors.displayName && (
                  <p className="text-sm text-destructive">
                    {errors.displayName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold">
                  Tên người dùng
                </Label>
                <Input id="username" type="text" {...register("username")} />
                {errors.username && (
                  <p className="text-sm text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email
                </Label>
                <Input id="email" type="text" {...register("email")} />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Số điện thoại
                </Label>
                <Input id="phone" type="text" {...register("phone")} />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold">
                Giới thiệu
              </Label>
              <Textarea
                id="bio"
                className="resize-none"
                rows={3}
                {...register("bio")}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full transition-all cursor-pointer md:w-auto bg-gradient-chat hover:opacity-90"
            >
              Lưu thay đổi
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default Personal;
