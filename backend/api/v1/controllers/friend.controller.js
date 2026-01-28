import User from "../models/user.model.js";
import FriendRequest from "../models/friendrequest.model.js";
import Friend from "../models/friend.model.js";

// [POST] /api/v1/friend/requests
export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;

    const from = req.user._id;

    if (to == from) {
      return res.status(400).json({
        message: "không thể gửi lời mời kết bạn cho chính mình",
      });
    }

    const userExists = await User.findOne({
      _id: to,
    });

    if (!userExists) {
      return res.status(404).json({
        message: "Người dùng không tồn tại",
      });
    }

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriend, existsRequest] = await Promise.all([
      Friend.findOne({
        userA: userA,
        userB: userB,
      }),
      FriendRequest.findOne({
        $or: [
          {
            from: from,
            to: to,
          },
          {
            from: to,
            to: from,
          },
        ],
      }),
    ]);

    if (alreadyFriend) {
      return res.status(400).json({
        message: "Hai người đã là bạn bè",
      });
    }

    if (existsRequest) {
      return res.status(400).json({
        message: "Đã có lời mời kết bạn đang chờ",
      });
    }

    const request = new FriendRequest({
      from: from,
      to: to,
      message: message,
    });

    await request.save();

    res.status(200).json({
      message: "Gửi lời mời kết bạn thành công",
      request: request,
    });
  } catch (error) {
    console.log("Lỗi khi gửi yêu cầu kết bạn", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/friend/requests/:requestId/accept
export const acceptFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.user._id; // userA

    const request = await FriendRequest.findOne({
      _id: requestId,
    });

    if (!request) {
      return res.status(404).json({
        message: "Không tìm thấy lời mời kết bạn",
      });
    }

    // người gửi kết bạn from userA to userB
    // userB != userA nên ko có quyền chấp nhận phải là người B đăng nhập thì mới có quyền chấp nhận lời mời đó
    if (request.to.toString() != userId.toString()) {
      return res.status(400).json({
        message: "chỉ có người nhận mới có thể chấp nhận lời mời",
      });
    }

    const friend = new Friend({
      userA: request.from,
      userB: request.to,
    });

    await friend.save();

    await FriendRequest.deleteOne({
      _id: requestId,
    });

    const from = await User.findOne({
      _id: request.from,
    })
      .select("_id displayName avatarUrl")
      .lean(); //Chỉ dùng khi đọc/trả về; trả object JS thuần, xử lý nhẹ và nhanh hơn, không dùng để sửa hay save

    res.status(200).json({
      message: "Chấp nhận lời mời kết bạn",
      from: from,
    });
  } catch (error) {
    console.log("Lỗi khi chấp nhận lời mời kết bạn", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/friend/requests/:requestId/decline
export const declineFriendRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.user._id;

    const request = await FriendRequest.findOne({
      _id: requestId,
    });

    if (!request) {
      return res.status(404).json({
        message: "không tìm thấy lời mời kết bạn",
      });
    }

    if (request.to.toString() != userId.toString()) {
      return res.status(400).json({
        message: "chỉ có người nhận mới có thể từ chối lời mời",
      });
    }

    await FriendRequest.deleteOne({
      _id: requestId,
    });

    res.status(200).json({
      message: "Từ chối lời mời kết bạn",
    });
  } catch (error) {
    console.log("Lỗi khi từ chối lời mời kết bạn", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/friend
export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendList = await Friend.find({
      $or: [
        {
          userA: userId,
        },
        {
          userB: userId,
        },
      ],
    })
      .populate("userA", "_id displayName avatarUrl")
      .populate("userB", "_id displayName avatarUrl")
      .lean();

    if (friendList.length == 0) {
      return res.status(200).json({
        friends: [],
      });
    }

    const friends = friendList.map((item) => {
      if (item.userA._id.toString() == userId.toString()) {
        return item.userB;
      } else {
        return item.userA;
      }
    });

    res.status(200).json({
      friends: friends,
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách bạn bè", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/friend/requests
export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const [sent, receive] = await Promise.all([
      FriendRequest.find({
        from: userId,
      }).populate("to", "_id username displayName avatarUrl"),
      FriendRequest.find({
        to: userId,
      }).populate("from", "_id username displayName avatarUrl"),
    ]);

    res.status(200).json({
      sent: sent,
      receive: receive,
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách danh sách yêu cầu kết bạn", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
