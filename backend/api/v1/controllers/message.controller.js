import { updateConversationAfterCreateMessage } from "../../../helpers/message.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// [GET] /api/v1/message/direct
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, conversationId, content, imgUrl } = req.body;
    const userId = req.user._id;

    let conversation;

    if (!content) {
      return res.status(400).json({
        message: "Thiếu nội dung",
      });
    }

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
      });
    }

    if (!conversationId) {
      conversation = new Conversation({
        type: "direct",
        participants: [
          { userId: userId, joinAt: new Date() },
          { userId: recipientId, joinAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });

      await conversation.save();
    }

    const message = new Message({
      conversationId: conversation._id,
      senderId: userId,
      content: content,
    });

    await message.save();

    // mỗi khi có tin nhắn mới thì phải cập nhật lại thông tin hội thoại
    updateConversationAfterCreateMessage(conversation, message, userId);

    await conversation.save();

    res.status(201).json({
      message: message,
    });
  } catch (error) {
    console.log("Lỗi khi gửi tin nhắn trực tiếp", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content, imgUrl } = req.body;
    const userId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json({
        message: "Thiếu nội dung",
      });
    }

    const message = new Message({
      conversationId: conversationId,
      senderId: userId,
      content: content,
    });

    await message.save();

    updateConversationAfterCreateMessage(conversation, message, userId);

    await conversation.save();

    res.status(201).json({
      message: message,
    });
  } catch (error) {
    console.log("Lỗi khi gửi tin nhắn nhóm", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
