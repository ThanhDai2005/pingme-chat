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
