import admin from "firebase-admin";
import User from "../api/v1/models/user.model.js";

export const sendNotificationToUser = async (
  userId,
  notification,
  data = {},
) => {
  try {
    const user = await User.findOne({ _id: userId }).select("fcmToken");

    if (!user || !user.fcmToken) {
      console.log(`User ${userId} không có FCM token`);
      return null;
    }

    const message = {
      token: user.fcmToken,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        ...data,
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
      },
      webpush: {
        fcmOptions: {
          link: data.link || "/",
        },
        notification: {
          icon: "/logo.png",
          badge: "/logo.png",
          vibrate: [200, 100, 200],
          requireInteraction: false,
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);

    // Nếu token không hợp lệ, xóa nó khỏi database
    if (
      error.code == "messaging/invalid-registration-token" ||
      error.code == "messaging/registration-token-not-registered"
    ) {
      await User.findOneAndUpdate({ _id: userId }, { fcmToken: null });
      console.log(`Removed invalid FCM token for user ${userId}`);
    }

    return null;
  }
};

export const sendNotificationToMultipleUsers = async (
  userIds,
  notification,
  data = {},
) => {
  try {
    const users = await User.find({
      _id: { $in: userIds },
      fcmToken: { $ne: null },
    }).select("fcmToken");

    if (users.length == 0) {
      console.log("Không có user nào có FCM token");
      return null;
    }

    const tokens = users.map((user) => user.fcmToken);

    const message = {
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: {
        ...data,
        clickAction: "FLUTTER_NOTIFICATION_CLICK",
      },
      webpush: {
        fcmOptions: {
          link: data.link || "/",
        },
        notification: {
          icon: "/logo.png",
          badge: "/logo.png",
          vibrate: [200, 100, 200],
          requireInteraction: false,
        },
      },
      tokens: tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Sent ${response.successCount} notifications successfully`);

    // Xóa các token không hợp lệ
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
        }
      });

      if (failedTokens.length > 0) {
        await User.updateMany(
          { fcmToken: { $in: failedTokens } },
          { fcmToken: null },
        );
        console.log(`Removed ${failedTokens.length} invalid FCM tokens`);
      }
    }

    return response;
  } catch (error) {
    console.error("Error sending notifications:", error);
    return null;
  }
};
