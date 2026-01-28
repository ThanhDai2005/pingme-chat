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
      return res.status.json({
        message: "Conversation type không hợp lệ",
      });
    }

    await conversation.populate([
      { path: "participants.userId", select: "displayName avatarUrl" },
      { path: "seenBy", select: "displayname avatarUrl" },
      { path: "lastMessage.senderId", select: "displayname  avatarUrl" },
    ]);

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
        { path: "lastMessage.senderId", select: "displayname  avatarUrl" },
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

    // cursor = mốc để phân trang
    const { limit, cursor } = req.query;

    const query = {
      conversationId: conversationId,
    };

    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) }; // Nếu có cursor → lấy tin cũ hơn thời điểm đó
    }

    const message = await Message.find(query)
      .sort({
        createdAt: -1,
      })
      .limit(Number(limit));

    // lấy thời điểm 'createdAt' của tin nhắn cuối cùng làm mốc (cursor) dùng để load tiếp lấy tin cũ hơn cursor.
    const nextCursor =
      message.length > 0 ? message[message.length - 1].createdAt : null;

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
