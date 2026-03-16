import { v2 as cloudinary } from "cloudinary";

let streamUpload = (buffer, options) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(
      {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_KEY,
        api_secret: process.env.CLOUD_SECRET,
        folder: "PingMe",
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
};

const uploadAvatar = async (buffer) => {
  return await streamUpload(buffer, {
    folder: "PingMe/avatars",
    transformation: [{ width: 200, height: 200, crop: "fill" }],
  });
};

const uploadMessageImage = async (buffer) => {
  return await streamUpload(buffer, {
    folder: "PingMe/messages",
  });
};

// Upload 1 ảnh
export const uploadSingle = async (req, res, next) => {
  try {
    let result;

    if (req.file.fieldname === "avatar") {
      result = await uploadAvatar(req.file.buffer);
    } else {
      result = await uploadMessageImage(req.file.buffer);
    }

    req.body[req.file.fieldname] = result.secure_url;
    req.body[`${req.file.fieldname}_id`] = result.public_id;
  } catch (error) {
    console.log(error);
  }

  next();
};

// upload nhiều ảnh
export const uploadMulti = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploads = req.files.map((file) => uploadMessageImage(file.buffer));

    const results = await Promise.all(uploads);
    const fieldName = req.files[0].fieldname;
    req.body[fieldName] = results.map((item) => ({
      url: item.secure_url,
    }));
  } catch (error) {
    console.log(error);
  }

  next();
};
