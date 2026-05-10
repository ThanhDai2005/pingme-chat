import User from "../models/user.model.js";

// [GET] /api/v1/user/detail
export const getDetail = async (req, res) => {
  try {
    res.status(200).json({
      message: "lấy thông tin thành công",
      user: req.user,
    });
  } catch (error) {
    console.log("Lỗi hệ thống", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [GET] /api/v1/user/search
export const searchUser = async (req, res) => {
  try {
    const username = req.query.username;
    const userId = req.user._id;

    if (!username || username.trim() == "") {
      return res.status(400).json({
        message: "Cần cung cấp username",
      });
    }

    const searchWords = username
      .trim()
      .split(/\s+/)
      .map((item) => new RegExp(item, "i"));

    const user = await User.find({
      _id: { $ne: userId },
      $and: searchWords.map((item) => ({
        $or: [{ username: item }, { displayName: item }],
      })),
    })
      .select("_id displayName username avatarUrl")
      .limit(10);

    res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log("Lỗi xảy ra khi searchUser", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/user/uploadAvatar
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!req.body.avatar) {
      return res.status(400).json({ message: "Không nhận được ảnh!" });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        avatarUrl: req.body.avatar,
        avatarId: req.body.avatar_id,
      },
      {
        new: true,
      },
    ).select("avatarUrl");

    res.json({
      message: "Cập nhật avatar thành công",
      avatarUrl: user.avatarUrl,
    });
  } catch (error) {
    console.log("Lỗi xảy ra khi upload Avatar", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/user/profile
export const updateInfo = async (req, res) => {
  try {
    const { displayName, username, email, phone, bio } = req.body;
    const userId = req.user._id;

    if (!displayName || !username || !email) {
      return res.status(400).json({
        message: "Không thể thiếu displayName, username, email, phone và bio",
      });
    }

    const existUser = await User.findOne({
      _id: { $ne: userId },
      username: username,
    });

    if (existUser) {
      return res.status(400).json({
        message: "Username đã tồn tại",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        displayName: displayName,
        username: username,
        email: email,
        phone: phone,
        bio: bio,
      },
      {
        new: true,
      },
    );

    res.json({
      message: "Cập nhật user thành công",
      user: user,
    });
  } catch (error) {
    console.log("Lỗi xảy ra khi updateInfo", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [PATCH] /api/v1/user/fcm-token
export const saveFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const userId = req.user._id;

    if (!fcmToken) {
      return res.status(400).json({ message: "Thiếu fcmToken" });
    }

    await User.findOneAndUpdate(
      { _id: userId },
      { fcmToken: fcmToken },
      { new: true },
    );

    res.status(200).json({ message: "Lưu FCM token thành công" });
  } catch (error) {
    console.log("Lỗi khi lưu FCM token", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// [DELETE] /api/v1/user/fcm-token
export const removeFcmToken = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findOneAndUpdate(
      { _id: userId },
      { fcmToken: null },
      { new: true },
    );

    res.status(200).json({ message: "Xóa FCM token thành công" });
  } catch (error) {
    console.log("Lỗi khi xóa FCM token", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
