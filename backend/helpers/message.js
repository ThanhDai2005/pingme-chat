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
      content: message.content,
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
