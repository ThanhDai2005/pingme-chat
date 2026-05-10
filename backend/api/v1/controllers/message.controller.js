import {
  emitDeleteMessage,
  emitNewMessage,
  emitUpdateMessage,
  updateConversationAfterCreateMessage,
  sendPushNotificationForMessage,
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

    // Gửi push notification cho các user offline
    sendPushNotificationForMessage(
      io,
      conversation,
      message,
      userId,
      req.user.displayName,
    );

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

    // Gửi push notification cho các user offline
    sendPushNotificationForMessage(
      io,
      conversation,
      message,
      userId,
      req.user.displayName,
    );

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

// [PATCH] /api/v1/message/:messageId/update
export const updateMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const messageId = req.params.messageId;
    const userId = req.user._id;

    if (!content) {
      return res.status(400).json({
        message: "Nội dung không được rỗng",
      });
    }

    const messageExist = await Message.findOne({
      _id: messageId,
    });

    if (!messageExist) {
      return res.status(404).json({
        message: "Không tìm thấy tin nhắn",
      });
    }

    if (messageExist.senderId.toString() != userId.toString()) {
      return res.status(400).json({
        message: "Chỉ có người gửi tin nhắn này mới được thay đổi",
      });
    }

    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
      },
      {
        content: content,
        isEdit: true,
      },
      {
        new: true,
      },
    );

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: message.conversationId,
      },
      {
        $set: {
          "lastMessage.content": content,
        },
      },
      { new: true },
    );

    emitUpdateMessage(io, conversation, message);

    res.status(200).json({
      message: message,
    });
  } catch (error) {
    console.log("Lỗi khi cập nhật tin nhắn", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/message/:messageId/delete
export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const userId = req.user._id;

    const messageExist = await Message.findOne({
      _id: messageId,
    });

    if (!messageExist) {
      return res.status(404).json({
        message: "Không tìm thấy tin nhắn",
      });
    }

    if (messageExist.senderId.toString() != userId.toString()) {
      return res.status(400).json({
        message: "Chỉ có người gửi tin nhắn này mới được thu hồi",
      });
    }

    const message = await Message.findOneAndUpdate(
      {
        _id: messageId,
      },
      {
        isDelete: true,
      },
      {
        new: true,
      },
    );

    let conversation = await Conversation.findOne({
      _id: message.conversationId,
    });

    const isLastMessage =
      conversation.lastMessage?.messageId.toString() == message._id.toString();

    if (isLastMessage) {
      conversation.lastMessage.content = "đã thu hồi 1 tin nhắn";

      await conversation.save();
    }

    emitDeleteMessage(io, conversation, message);

    res.status(200).json({
      message: message,
    });
  } catch (error) {
    console.log("Lỗi khi xoá tin nhắn", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/message/upload
export const uploadImage = async (req, res) => {
  try {
    const imgUrl = req.body.imgUrl;

    res.status(200).json({
      imgUrl: imgUrl,
    });
  } catch (error) {
    console.log("Lỗi khi gửi tin uploadImage", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
