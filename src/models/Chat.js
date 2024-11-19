import { mongoose } from "../index.js";
const chatSchema = new mongoose.Schema(
  {
    room_id: {
      type: String,
      required: false,
    },
    messages: [
      {
        from: String,
        message: String,
        image: String,
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        time: { type: Date, default: Date.now },
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", chatSchema);
export { Chat };


