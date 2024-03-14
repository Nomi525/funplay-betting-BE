import { UserNotification } from "../../models/UserNotification.js";
import { ResponseMessage, StatusCodes, handleErrorResponse, sendResponse } from "../../index.js";
import { Socket } from "../../config/Socket.config.js";
Socket.on("connection", (sockets) => {


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
    const getData = await UserNotification.find({ userId: req.user, is_deleted: false })
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


export const deleteAllUserNotifications = async (req, res) => {
  try {
    const deletedNotification = await UserNotification.updateMany({ userId: req.user }, { is_deleted: true });
    if (deletedNotification) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.NOTIFICATION_DELETED
      );
    } else {
      return sendResponse(
        res,
        StatusCodes.NOT_FOUND,
        ResponseMessage.NOTIFICATION_NOT_DELETED
      );
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}