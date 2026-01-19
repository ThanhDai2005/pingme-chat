export const getDetail = async (req, res) => {
  try {
    res.status(200).json({
      message: "lấy thông tin thành công",
      userDetail: req.userDetail,
    });
  } catch (error) {
    console.log("Lỗi hệ thống", error);
    res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const test = async (req, res) => {
  res.status(200).json({});
};
