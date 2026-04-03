import { io } from "../../../socket/index.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

// [POST] /api/v1/conversation
export const createConversation = async (req, res) => {
  try {
    const { type, name, memberIds } = req.body;
    const userId = req.user._id;

    if (
      !type ||
      (type == "group" && !name) ||
      !memberIds ||
      !Array.isArray(memberIds) ||
      memberIds.length == 0
    ) {
      return res.status(400).json({
        message: "Tên nhóm và danh sách thành viên là bắt buộc",
      });
    }

    let conversation;

    if (type == "direct") {
      const participantId = memberIds[0];

      // $all yêu cầu tất cả các giá trị được liệt kê phải tồn tại trong mảng trường đó, không quan trọng thứ tự.

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId: userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save();
      }
    }

    if (type == "group") {
      conversation = new Conversation({
        type: "group",
        participants: [
          { userId: userId },
          ...memberIds.map((item) => ({ userId: item })),
        ],
        group: {
          name: name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });

      await conversation.save();
    }

    if (!conversation) {
      return res.status(400).json({
        message: "Conversation type không hợp lệ",
      });
    }

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayname avatarUrl" },
      { path: "lastMessage.senderId", select: "displayname  avatarUrl" },
    ]);

    // Thông báo cho tất cả thành viên trong mảng memberIds rằng họ đã được thêm vào nhóm mới
    if (type == "group") {
      memberIds.forEach((item) => {
        io.to(item).emit("new-group", conversation);
      });
    }

    res.status(201).json({
      conversation: conversation,
    });
  } catch (error) {
    console.log("Lỗi khi tạo conversation", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/conversation
export const getConversation = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversation = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({
        lastMessageAt: -1,
        updatedAt: -1,
      })
      .populate([
        { path: "participants.userId", select: "displayName avatarUrl" },
        { path: "seenBy", select: "displayname avatarUrl" },
        { path: "lastMessage.senderId", select: "displayname avatarUrl" },
      ]);

    res.status(200).json({
      conversation: conversation,
    });
  } catch (error) {
    console.log("Lỗi khi lấy conversation", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/conversation/:conversationId/message
export const getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user._id;

    // cursor = mốc để phân trang
    const { limit, cursor } = req.query;

    const query = {
      conversationId: conversationId,
    };

    const conversation = await Conversation.findOne({
      _id: conversationId,
    });

    const userDeletedAt = conversation.deletedAt.get(userId.toString());

    if (userDeletedAt) {
      query.createdAt = { $gt: userDeletedAt };
    }

    //  giữ lại những gì đang có trong query.createdAt (ví dụ mốc $gt từ userDeletedAt trước đó) và thêm/gộp thêm điều kiện $lt vào. { $gt: mốc_xóa, $lt: mốc_cursor }
    if (cursor) {
      query.createdAt = {
        ...query.createdAt,
        $lt: new Date(cursor),
      }; // Nếu có cursor → lấy tin cũ hơn thời điểm đó
    }

    const message = await Message.find(query)
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit) + 1);

    // lấy thời điểm 'createdAt' của tin nhắn cuối cùng làm mốc (cursor) dùng để load tiếp lấy tin cũ hơn cursor.
    let nextCursor = null;

    if (message.length > limit) {
      nextCursor = message[message.length - 1].createdAt;
      message.pop();
    }

    return res.status(200).json({
      message: message.reverse(),
      nextCursor: nextCursor,
    });
  } catch (error) {
    console.log("Lỗi khi lấy message", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const getUserConversationForSocketIo = async (userId) => {
  try {
    const conversation = await Conversation.find({
      "participants.userId": userId,
    }).select("_id");

    return conversation.map((convo) => convo._id.toString());
  } catch (error) {
    console.log("Lỗi khi lấy getUserConversationForSocketIo", error);
    return [];
  }
};

// [PATCH] /api/v1/conversation/:conversationId/seen
export const markAsSeen = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation không tồn tại",
      });
    }

    const lastMessage = conversation.lastMessage;

    if (!lastMessage) {
      return res.status(404).json({
        message: "không có tin nhắn để markAsSeen",
      });
    }

    if (lastMessage.senderId.toString() == userId.toString()) {
      return res.status(200).json({
        message: "Sender không cần markAsSeen",
      });
    }

    const updated = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
      },
      {
        $addToSet: { seenBy: userId },
        $set: { [`unreadCounts.${userId}`]: 0 },
      },
      { new: true },
    );

    io.to(conversationId).emit("read-message", {
      conversation: updated,
    });

    res.status(200).json({
      message: "Mark As Seen",
      seenBy: updated.seenBy || [],
      unreadCounts: updated.unreadCounts[userId] || 0,
    });
  } catch (error) {
    console.log("Lỗi khi cập nhật markAsSeen", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/conversation/:conversationId/delete
export const deleteConversation = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    const userId = req.user._id;

    const existConversation = await Conversation.findOne({
      _id: conversationId,
    });

    if (!existConversation) {
      return res.status(404).json({
        message: "Conversation không tồn tại",
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
      },
      {
        $set: { [`deletedAt.${userId}`]: new Date() },
      },
      { new: true },
    );

    res.status(200).json({
      message: "Xóa cuộc hội thoại thành công",
      conversation: conversation,
    });
  } catch (error) {
    console.log("Lỗi khi xóa conversation", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
