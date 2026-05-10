import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // link CDN để hiên thị hình
    },
    avatarId: {
      type: String, // Cloudinary public_id để xóa hình
    },
    bio: {
      type: String,
    },
    phone: {
      type: String,
      sparse: true, // cho phép null, nhưng không được trùng
    },
    fcmToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema, "users");

export default User;
