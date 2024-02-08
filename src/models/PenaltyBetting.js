import { mongoose } from "../index.js";

const penaltyBettingSchema = new mongoose.Schema(
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
        betSide: {
            type: String,
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
            enum: [null, "loose", "pending", "won"],
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

const PenaltyBetting = mongoose.model("PenaltyBetting", penaltyBettingSchema);
export { PenaltyBetting };
