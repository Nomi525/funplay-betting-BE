import { mongoose } from '../index.js';

const gameRulesSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Game",
        required: false
    },
    gameRules: {
        type: Array,
        required: false
    },
    is_deleted: {
        type: Number,
        default : 0 
    },
}, { timestamps: true });

const GameRules = mongoose.model('GameRules', gameRulesSchema);

export { GameRules };