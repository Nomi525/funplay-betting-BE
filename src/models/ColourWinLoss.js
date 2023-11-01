import { mongoose } from '../index.js';

const colourWinLossSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: false
    },
    betId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ColourBetting",
        required: false
    },
    colourName: {
        type: String,
        required: false,
    },
    betAmount: {
        type: String,
        required: false,
        default: 0
    },
    rewardAmount: {
        type: String,
        required: false,
        default: 0
    },
    period: {
        type: Number,
        required: false,
        default: 0
    },
    isWin: {
        type: Boolean,
        required: false,
        default: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const ColourWinLoss = mongoose.model('ColourWinLoss', colourWinLossSchema);

export { ColourWinLoss };