import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
    },
    imgUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

messageSchema.index({
  conversationId: 1,
  createdAt: -1,
});
// Message.find({ conversationId: "abc123" }).sort({ createdAt: -1 });
// → Mongo dùng đúng index này để:
// Lọc nhanh theo conversationId
// Trong mỗi cuộc hội thoại → sắp message theo createdAt giảm dần (mới nhất trước)
const Message = mongoose.model("Message", messageSchema, "messages");

export default Message;
