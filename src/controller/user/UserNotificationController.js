import { UserNotification } from "../../models/UserNotification.js";
import { StatusCodes, handleErrorResponse, sendResponse } from "../../index.js";
import { Socket } from "../../config/Socket.config.js";
Socket.on("connection", (sockets) => {
  console.log("notification Socket connected");

  sockets.on("join-notification-room", async (room) => {
    console.log("join-notification-room", room);
    sockets.join(room.userId);
  });

  sockets.on("new-notification", (user) => {
    console.log("new-notification")
    Socket.emit("new-notification");
    // sockets.in(user).emit("new-notification");
  });
});

export const getUserNotifications = async (req, res) => {
  try {
    const getData = await UserNotification.find({ userId: req.user })
      //   .populate("userId", "fullName currency")
      .sort({ createdAt: -1 });
    if (getData) {
      return sendResponse(
        res,
        StatusCodes.OK,
        "User notification fetched.",
        getData
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        "Failed to fetch user notification",
        []
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};
