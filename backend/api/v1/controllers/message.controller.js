import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from "../../../helpers/message.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { io } from "../../../socket/index.js";

// [GET] /api/v1/message/direct
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, conversationId, content, imgUrl } = req.body;
    const userId = req.user._id;

    let conversation;

    if (!content && !imgUrl) {
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
      imgUrl: imgUrl,
    });

    await message.save();

    // mỗi khi có tin nhắn mới thì phải cập nhật lại thông tin hội thoại
    updateConversationAfterCreateMessage(conversation, message, userId);

    await conversation.save();

    emitNewMessage(io, conversation, message);

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

// [GET] /api/v1/message/group
export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content, imgUrl } = req.body;
    const userId = req.user._id;
    const conversation = req.conversation;

    if (!content && !imgUrl) {
      return res.status(400).json({
        message: "Thiếu nội dung",
      });
    }

    const message = new Message({
      conversationId: conversationId,
      senderId: userId,
      content: content,
      imgUrl: imgUrl,
    });

    await message.save();

    updateConversationAfterCreateMessage(conversation, message, userId);

    await conversation.save();

    emitNewMessage(io, conversation, message);

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

// [GET] /api/v1/message/upload
export const uploadImage = async (req, res) => {
  try {
    const imgUrl = req.body.imgUrl;

    res.json({
      imgUrl: imgUrl,
    });
  } catch (error) {
    console.log("Lỗi khi gửi tin uploadImage", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
