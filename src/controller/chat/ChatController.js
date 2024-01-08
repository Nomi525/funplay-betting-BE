// const { verify } = require("jsonwebtoken");
import { StatusCodes } from "http-status-codes";
import { Socket } from "../../../Socket.config.js";
import { Chat } from "../../models/Chat.js";
import { getAllData } from "../../services/QueryService.js";
import { ResponseMessage } from "../../utils/ResponseMessage.js";
import { handleErrorResponse } from "../../services/CommonService.js";
import { User } from "../../models/User.js";

// Socket.use((socket, next) => {
//   try {
//     const token = socket.handshake.auth.token;
//     if (!token) {
//       return next(new Error("invalid token"));
//     }
//     const decode = verify(token, process.env.SECRET_KEY);
//     socket._id = decode.userId;
//     next();
//   } catch (e) {
//     return next(new Error("invalid token"));
//   }
// });

Socket.on("connection", (sockets) => {
  console.log("Socket connected");
  // sockets.on("UploadImage", async (file) => {
  //   console.log(file); // <Buffer 25 50 44 ...>

  //   // save the content to the disk, for example
  //   writeFile("/tmp/upload", file, (err) => {
  //     console.log(file);
  //     console.log({ message: err ? "failure" : "success" });
  //   });''
  // });
  sockets.on("JoinChat", async (room) => {
    sockets.join(room.room_id);
    let chat = await Chat.findOne({ room_id: room.room_id });
    Socket.in(chat.room_id).emit("Message", chat.messages);
    let checkUserRegister = await User.findOne({ _id: room.user_id });

    if (checkUserRegister) {
      sockets.on("NewMessage", async (data) => {
        console.log(data, "NewMessage");
        // Check if the user is allowed to send messages in this room
        if (sockets.rooms.has(room.room_id)) {
          let ifRoom = await Chat.findOne({ room_id: room.room_id });
          await Chat.findOneAndUpdate(
            { room_id: ifRoom.room_id },
            {
              $push: {
                messages: [
                  {
                    from: checkUserRegister.fullName,
                    message: data.message,
                    user_id: room.user_id,
                  },
                ],
              },
            }
          );

          let res = await Chat.findOne({ room_id: room.room_id });
          Socket.in(res.room_id).emit("Message", res.messages);
        } else {
          // User is not allowed to send messages in this room
          sockets.emit(
            "ErrorMessage",
            "You are not authorized to send messages in this room."
          );
        }
      });
    } else {
      sockets.emit(
        "ErrorMessage",
        "You are not authorized to send messages in this room."
      );
    }
  });
});

export const getChat = async (req, res) => {
  try {
    let findChat = await getAllData({}, Chat);
    if (findChat) {
      return sendResponse(
        res,
        StatusCodes.OK,
        ResponseMessage.DATA_GET,
        findChat
      );
    } else {
      return sendResponse(res, StatusCodes.OK, ResponseMessage.DATA_GET, []);
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export const uploadImage = async (req, res) => {
  try {
    req.body.image = req.files ? req.files.key : null;
    let filename = req.files.image[0].filename;
    let checkUserRegister = await User.findOne({ _id: req.body.user_id });
    if (checkUserRegister) {
      await Chat.findOneAndUpdate(
        { room_id: req.body.room_id },
        {
          $push: {
            messages: {
              from: checkUserRegister.fullName,
              image: filename,
              user_id: req.body.user_id,
              time: new Date(),
            },
          },
        }
      );
      return res.status(200).json({
        status: StatusCodes.OK,
        message: ResponseMessage.IMAGE_UPLOADED,
        data: { image: filename },
      });
    } else {
      return res.status(400).json({
        status: StatusCodes.BAD_REQUEST,
        message: ResponseMessage.BAD_REQUEST,
        data: {},
      });
    }
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { Socket };
