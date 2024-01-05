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
        time: { type: Date, default: new Date() },
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
