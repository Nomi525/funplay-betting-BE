// const { verify } = require("jsonwebtoken");

import { writeFile } from "fs";
import { Socket } from "../../config/Socket.config.js";
import { User } from "../../models/User.js";
import { Chat } from "../../models/Chat.js";
import { handleErrorResponse } from "../../services/CommonService.js";
import { StatusCodes } from "http-status-codes";
import { ResponseMessage } from "../../utils/ResponseMessage.js";

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


  sockets.on("JoinChat", async (room) => {
    sockets.join(room.room_id);
    let chat = await Chat.findOne({ room_id: room.room_id }).populate("messages.user_id", "fullName profile");

    if (chat) {
      Socket.emit("Message", chat.messages);

      let checkUserRegister = await User.findOne({ _id: room.user_id });

      if (checkUserRegister) {

        sockets.on("NewMessage", async (data) => {
          // Check if the user is allowed to send messages in this room
          if (sockets.rooms.has(room.room_id)) {
            let ifRoom = await Chat.findOne({ room_id: room.room_id });

            let save = await Chat.findOneAndUpdate(
              { room_id: ifRoom.room_id },
              {
                $push: {
                  messages: [
                    {
                      from: checkUserRegister.fullName,
                      message: data.message,
                      user_id: checkUserRegister._id,
                    },
                  ],
                },
              }
            );

            let res = await Chat.findOne({ room_id: room.room_id }).populate("messages.user_id", "fullName profile");

            Socket.emit("Message", res.messages);
          } else {
            let saveNewChat = new Chat({
              room_id: 1,
            });
            await saveNewChat.save();
            // User is not allowed to send messages in this room
            sockets.emit("Message", saveNewChat);
          }
        });
      } else {
        Socket.emit(
          "ErrorMessage",
          "You are not authorized to send messages in this room."
        );
        //   let saveNewChat = new Chat({
        //     room_id: 1,
        //   });
        //   await saveNewChat.save();
      }
    } else {
      let saveNewChat = new Chat({
        room_id: 1,
      });
      await saveNewChat.save();
    }
  });
});

export const uploadImage = async (req, res) => {
  try {
    req.body.image = req.files ? req.files.key : null;
    let filename = req.files.image[0].filename;
    let checkUserRegister = await User.findOne({ _id: req.body.user_id });
    if (checkUserRegister) {
      let showAllChat = await Chat.findOneAndUpdate(
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
        data: [showAllChat],
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
