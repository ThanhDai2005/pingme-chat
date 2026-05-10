import { sendNotificationToMultipleUsers } from "./notification.js";

export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId,
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      messageId: message._id,
      type: message.imgUrl?.length > 0 ? "file" : "text",
      content:
        message.imgUrl?.length > 0
          ? (() => {
              const first = message.imgUrl[0];

              if (message.imgUrl.length > 1) {
                return `đã gửi ${message.imgUrl.length} file đính kèm`;
              }

              if (first.fileType == "image") return "đã gửi 1 ảnh";
              if (first.fileType == "video") return "đã gửi 1 video";
              return "đã gửi 1 file đính kèm";
            })()
          : message.content,
      senderId: senderId,
      createdAt: message.createdAt,
    },
  });

  conversation.participants.forEach((item) => {
    const memberId = item.userId.toString();
    const isSender = memberId == senderId.toString();
    const prevCount = conversation.unreadCounts.get(memberId) || 0; // lấy giá trị unreadCounts của từng participants trong map
    conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);
  });
};

export const emitNewMessage = (io, conversation, message) => {
  io.to(conversation._id.toString()).emit("new-message", {
    message: message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
      lastMessageAt: conversation.lastMessageAt,
      unreadCounts: conversation.unreadCounts,
    },
  });
};

export const emitUpdateMessage = (io, conversation, message) => {
  io.to(conversation._id.toString()).emit("update-message", {
    message: message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
    },
  });
};

export const emitDeleteMessage = (io, conversation, message) => {
  io.to(conversation._id.toString()).emit("delete-message", {
    message: message,
    conversation: {
      _id: conversation._id,
      lastMessage: conversation.lastMessage,
    },
  });
};

export const sendPushNotificationForMessage = async (
  io,
  conversation,
  message,
  senderId,
  senderName,
) => {
  try {
    // Lấy tất cả participants NGOẠI TRỪ người gửi
    const recipientIds = conversation.participants
      .map((p) => p.userId.toString())
      .filter((id) => id != senderId.toString());

    if (recipientIds.length == 0) return;

    // Kiểm tra ai đang online (có socket kết nối)
    const onlineSockets = await io.fetchSockets();
    const onlineUserIds = new Set(
      onlineSockets.map((s) => s.user?._id?.toString()).filter(Boolean),
    );

    // Chỉ gửi push notification cho những user OFFLINE
    const offlineUserIds = recipientIds.filter((id) => !onlineUserIds.has(id));

    if (offlineUserIds.length == 0) {
      console.log("Tất cả recipients đang online, không cần push notification");
      return;
    }

    // Xây dựng nội dung notification
    let notificationBody = "";
    if (message.content) {
      notificationBody = message.content;
    } else if (message.imgUrl?.length > 0) {
      const first = message.imgUrl[0];
      if (message.imgUrl.length > 1) {
        notificationBody = `đã gửi ${message.imgUrl.length} file đính kèm`;
      } else if (first.fileType == "image") {
        notificationBody = "đã gửi 1 ảnh";
      } else if (first.fileType == "video") {
        notificationBody = "đã gửi 1 video";
      } else {
        notificationBody = "đã gửi 1 file đính kèm";
      }
    }

    const isGroup = conversation.type == "group";
    const notificationTitle = isGroup
      ? `${senderName} (${conversation.group?.name || "Nhóm chat"})`
      : senderName;

    await sendNotificationToMultipleUsers(
      offlineUserIds,
      {
        title: notificationTitle,
        body: notificationBody || "Bạn có tin nhắn mới",
      },
      {
        conversationId: conversation._id.toString(),
        senderId: senderId.toString(),
        type: "new-message",
        link: `/?conversation=${conversation._id}`,
      },
    );
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};
