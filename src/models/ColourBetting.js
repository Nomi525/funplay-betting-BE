import { validate } from "node-cron";
import { mongoose } from "../index.js";

const colourBettingSchema = new mongoose.Schema(
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
    colourName: {
      type: String,
      required: false,
    },
    colourNumber: {
      type: Number,
      required: false,
      default: null,
    },
    betAmount: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    count: {
      type: Number,
      required: false,
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
    gameType: {
      type: String,
      required: false,
    },
    selectedTime: {
      type: String,
      required: false,
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

const colourBettingSchemaNew = new mongoose.Schema(
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
    colourName: {
      type: String,
      required: false,
      default: null,
    },
    colourNumber: {
      type: Number,
      required: false,
      default: null,
    },
    betAmount: {
      type: Number,
      required: false,
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    count: {
      type: Number,
      required: false,
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
    gameType: {
      type: String,
      required: false,
    },
    selectedTime: {
      type: String,
      required: false,
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

const ColourBettingNew = mongoose.model(
  "ColourBettingNew",
  colourBettingSchemaNew
);

const ColourBetting = mongoose.model("ColourBetting", colourBettingSchema);

export { ColourBetting, ColourBettingNew };
