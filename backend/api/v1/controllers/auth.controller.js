import User from "../models/user.model.js";
import Session from "../models/session.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TIME = "30m"; // thường là dưới 15m
const REFRESH_TOKEN_TIME = 14 * 24 * 60 * 60 * 1000; // 14 ngày

// [POST] /api/v1/auth/signup
export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName và lastName",
      });
    }

    // kiểm tra username tồn tại chưa
    const existUserName = await User.findOne({
      username: username,
    });

    if (existUserName) {
      return res.status(400).json({
        message: "username đã tồn tại",
      });
    }

    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    // tạo user mới
    const user = new User({
      username: username,
      hashedPassword: hashedPassword,
      email: email,
      displayName: `${firstName} ${lastName}`,
    });

    await user.save();

    // return
    res.status(201).json({
      message: "Đăng ký thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi signUp", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/auth/signin
export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu username hoặc password",
      });
    }

    const user = await User.findOne({
      username: username,
    });

    if (!user) {
      return res.status(401).json({
        message: "username hoặc password không chính xác",
      });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "username hoặc password không chính xác",
      });
    }

    // nếu khớp, tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TIME },
    );

    // tạo refreshToken
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // tạo session mới để lưu refresh token
    const session = new Session({
      userId: user._id,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TIME),
    });

    // trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // backend, frontend deploy riêng
      maxAge: REFRESH_TOKEN_TIME,
    });

    await session.save();

    // trả access token về trong res
    res.status(200).json({
      message: `User ${user.displayName} đã logged`,
      accessToken: accessToken,
    });
  } catch (error) {
    console.log("Lỗi khi gọi signIn", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/auth/signout
export const signOut = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      // xóa refresh token trong session
      await Session.deleteOne({
        refreshToken: refreshToken,
      });
      // Xóa cookie
      res.clearCookie("refreshToken");
    }

    res.status(200).json({
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    console.log("Lỗi khi gọi signOut", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

// [POST] /api/v1/auth/refresh
export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: "Token không tồn tại",
      });
    }

    // so với refresh token trong db
    const session = await Session.findOne({
      refreshToken: refreshToken,
    });

    if (!session) {
      return res.status(401).json({
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(401).json({
        message: "Token đã hết hạn",
      });
    }

    // tạo accessToken mới
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TIME },
    );

    res.status(200).json({
      accessToken: accessToken,
    });
  } catch (error) {
    console.log("Lỗi khi gọi refreshToken", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
