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
    gameRound: {
        type: Number,
        required: false
    },
    gameWinningAmount: {
        type: Number,
        required: false
    },
    gameTimeFrom : {
        type: String,
        required: false
    },
    gameTimeTo : {
        type: String,
        required: false
    },
    gameDuration : {
        type: Number,
        required: false
    },
    description : {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    is_deleted: {
        type: Number,
        default : 0 
    },
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export { Game };