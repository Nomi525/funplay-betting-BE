import { mongoose } from '../index.js';

const gameRewardSchema = new mongoose.Schema({
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
    colourName : {
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
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const GameReward = mongoose.model('GameReward', gameRewardSchema);

export { GameReward };