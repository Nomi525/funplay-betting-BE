import { mongoose } from "./../index.js";

const numberBettingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: false,
    },
    number: {
      type: Number,
      required: false,
    },
    betAmount: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    winAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    period: {
      type: Number,
      required: false,
      default: 0,
    },
    rewardAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    lossAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    isWin: {
      type: Boolean,
      required: false,
      default: false,
    },
    status: {
      type: String,
      enum: [null, "fail", "pending", "successfully"],
      required: false,
      default: "pending",
    },
    is_deleted: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);


const numberBettingSchemaNew = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: false,
    },
    number: {
      type: Number,
      required: false,
    },
    betAmount: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    winAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    period: {
      type: Number,
      required: false,
      default: 0,
    },
    rewardAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    lossAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    isWin: {
      type: Boolean,
      required: false,
      default: false,
    },
    status: {
      type: String,
      enum: ["fail", "pending", "successfully"],
      required: false,
      default: "pending",
    },
    is_deleted: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

const NumberBettingNew = mongoose.model("NumberBettingNew", numberBettingSchemaNew)
const NumberBetting = mongoose.model("NumberBetting", numberBettingSchema);
export { NumberBetting, NumberBettingNew };
