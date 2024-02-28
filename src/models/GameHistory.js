import { mongoose } from '../index.js';

const gameHistorySchema = new mongoose.Schema({
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
    betAmount: {
        type: String,
        required: false,
        default: 0,
    },
    winAmount: {
        type: String,
        required: false,
        default: 0,
    },
    loseAmount: {
        type: String,
        required: false,
        default: 0,
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const GameHistory = mongoose.model('GameHistory', gameHistorySchema);

export { GameHistory };