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
        type: Date,
        required: false
    },
    gameEndDate: {
        type: Date,
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
    gameHours: {
        type: String,
        required: false
    },
    gameTimeFrom: {
        type: Date,
        required: false
    },
    gameTimeTo: {
        type: Date,
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
    gameSecond: [{
        type: String,
        required: false
    }],
    isRepeat: {
        type: Boolean,
        required: false,
        default: false
    },
    iconImage: {
        type: String,
        required: false
    },
    betAmount: {
        type: Number,
        required: false,
        default: 0
    },
    noOfUsers: {
        type: Number,
        required: false,
        default: 0
    },
    winnersPercentage: [{
        type: Number,
        required: false,
        default: 0
    }],
    is_deleted: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export { Game };