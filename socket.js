// const { verify } = require("jsonwebtoken");
import { Socket } from "./Socket.config.js";
import { Chat, User } from "./src/index.js";
import { writeFile } from "fs";

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
    sockets.on("UploadImage", async (file) => {
      console.log(file); // <Buffer 25 50 44 ...>

      // save the content to the disk, for example
      writeFile("/tmp/upload", file, (err) => {
        console.log(file);
        console.log({ message: err ? "failure" : "success" });
      });''
    });
  sockets.on("JoinChat", async (room) => {
    sockets.join(room.room_id);
    let chat = await Chat.findOne({ room_id: room.room_id });
    Socket.in(chat.room_id).emit("Message", chat.messages);
  
    let checkUserRegister = await User.findOne({ _id: room.user_id });
    if (checkUserRegister) {
      sockets.on("NewMessage", async (data) => {
        // Check if the user is allowed to send messages in this room
        if (sockets.rooms.has(room.room_id)) {
          let ifRoom = await Chat.findOne({ room_id: room.room_id });

          await Chat.findOneAndUpdate(
            { room_id: ifRoom.room_id },
            {
              $push: {
                messages: [
                  { from: checkUserRegister.fullName, message: data.message },
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
export { Socket };
