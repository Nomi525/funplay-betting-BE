import { mongoose } from '../index.js';

const gameSchema = new mongoose.Schema({
    gameName: {
        type: String,
        required: false
    },
    gameImage: {
        type: String,
        required: false
    },
    gameStartDate: {
        type: String,
        required: false
    },
    gameEndDate: {
        type: String,
        required: false
    },
    gameRound: {
        type: Number,
        required: false
    },
    gameWinningAmount: {
        type: Number,
        required: false
    },
    gameTimeFrom: {
        type: String,
        required: false
    },
    gameTimeTo: {
        type: String,
        required: false
    },
    gameDurationFrom: {
        type: String,
        required: false
    },
    gameDurationTo: {
        type: String,
        required: false
    },
    gameMode: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    // gameWeek: [{
    //     type: String,
    //     enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    //     required: false
    // }],
    gameMinimumCoin: {
        type: Number,
        required: false
    },
    gameMaximumCoin: {
        type: Number,
        required: false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    gameTime: [{
        type: String,
        required: false
    }],
    is_deleted: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export { Game };