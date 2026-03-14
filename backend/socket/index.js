import { Server } from "socket.io";
import { socketAuthMiddleware } from "../api/v1/middlewares/socket.middleware.js";
import { getUserConversationForSocketIo } from "../api/v1/controllers/conversation.controller.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  const onlineUsers = new Map(); // { userId: socketId }

  io.on("connection", async (socket) => {
    const user = socket.user;

    console.log(`${user.displayName} online: ${socket.id}`);

    onlineUsers.set(user._id.toString(), socket.id);

    io.emit("online-users", Array.from(onlineUsers.keys()));

    const conversationIds = await getUserConversationForSocketIo(user._id);
    conversationIds.forEach((convo) => socket.join(convo));

    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // Đưa user vào một "phòng riêng" mang ID của chính họ.
    // Giúp Server có thể gửi tin nhắn/thông báo riêng cho user này từ bất cứ đâu bằng lệnh io.to(userId).
    socket.join(user._id.toString());

    socket.on("disconnect", () => {
      onlineUsers.delete(user._id.toString());
      io.emit("online-users", Array.from(onlineUsers.keys()));
      console.log("socket disconnected:", socket.id);
    });
  });

  return io;
};

export { io };
