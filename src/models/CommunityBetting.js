import { mongoose } from "./../index.js";

const communityBettingSchema = new mongoose.Schema(
  {
    period: {
      type: Number,
      required: false,
    },
    // count: {
    //   type: Number,
    //   required: false,
    //   default: 0,
    // },
    startDate: {
      type: Date,
      required: false,
    },
    betAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    endDate: {
      type: Date,
      required: false,
    },
    gameRounds: {
      type: Number,
      required: false,
      default: 0,
    },
    winningAmount: {
      type: Number,
      required: false,
      default: 0,
    },
    noOfWinners: {
      type: Number,
      required: false,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Game",
    },
    rewardAmount: {
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
      default: null,
    },
    is_deleted: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true }
);

const CommunityBetting = mongoose.model(
  "CommunityBetting",
  communityBettingSchema
);
export { CommunityBetting };
