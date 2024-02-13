// const { verify } = require("jsonwebtoken");
import { Socket } from "./src/config/Socket.config.js";
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
    });
    ("");
  });
  sockets.on("JoinChat", async (room) => {
    console.log("hii1");
    sockets.join(room.room_id);
    let chat = await Chat.findOne({ room_id: room.room_id });
    console.log(chat);
    if (chat) {
      // console.log(chat);
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
                    { from: checkUserRegister.fullName, message: data.message },
                  ],
                },
              }
            );
            console.log(save, "61");
            let res = await Chat.findOne({ room_id: room.room_id });
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
export { Socket };
