import Conversation from "../models/conversation.model.js";
import Friend from "../models/friend.model.js";

export const checkFriendSendDirectMessage = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const recipientId = req.body.recipientId;

    if (!recipientId) {
      return res.status(400).json({
        message: "Cần cung cấp recipientId",
      });
    }

    let userA = userId.toString();
    let userB = recipientId.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const isFriend = await Friend.findOne({
      userA: userA,
      userB: userB,
    });

    if (!isFriend) {
      return res.status(400).json({
        message: "Bạn chưa kết bạn với người này",
      });
    }

    next();
  } catch (error) {
    console.log("Lỗi khi kiểm tra có phải bạn bè không", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const checkFriendCreateGroup = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const memberIds = req.body.memberIds;

    if (!Array.isArray(memberIds) || memberIds.length == 0) {
      return res.status(400).json({
        message: "Cần cung cấp memberIds",
      });
    }

    const conditions = memberIds.map((memberId) => {
      let userA = userId.toString();
      let userB = memberId.toString();

      if (userA > userB) {
        [userA, userB] = [userB, userA];
      }

      return {
        userA: userA,
        userB: userB,
      };
    });

    const isFriend = await Friend.find({
      $or: conditions,
    });

    if (isFriend.length != memberIds.length) {
      return res.status(400).json({
        message: `Bạn chỉ có thể thêm những người đã kết bạn vào nhóm`,
      });
    }

    next();
  } catch (error) {
    console.log("Lỗi khi kiểm tra có phải bạn bè trong nhóm không", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const checkFriendSendGroupMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
    });

    if (!conversation) {
      return res.status(400).json({
        message: "Không tìm thấy cuộc trò chuyện",
      });
    }

    const checkUserConversation = conversation.participants.some(
      (item) => item.userId.toString() == userId.toString(),
    );

    if (!checkUserConversation) {
      return res.status(400).json({
        message: "Bạn không nằm trong group này",
      });
    }

    req.conversation = conversation;

    next();
  } catch (error) {
    console.log("Lỗi checkFriendCreateGroup", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
