import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// authorization - xác minh user là ai
export const requireAuth = async (req, res, next) => {
  try {
    // lấy accessToken từ header
    const authHeader = req.headers.authorization;
    const accessToken = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!accessToken) {
      return res.status(401).json({
        message: "Không tìm thấy accessToken",
      });
    }

    // xác nhận token hợp lệ
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          console.log(err);

          return res.status(401).json({
            message: "Access token hết hạn hoặc không đúng",
          });
        }

        const userDetail = await User.findOne({
          _id: user.userId,
        }).select("-hashedPassword");

        if (!userDetail) {
          return res.status(404).json({
            message: "người dùng không tồn tại",
          });
        }

        req.userDetail = userDetail;
        next();
      }
    );
  } catch (error) {
    console.log("Lỗi khi xác minh JWT trong authMiddleware", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};
