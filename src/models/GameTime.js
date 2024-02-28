import { mongoose } from "../index.js";


const gameTimeSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: false
    },
    gameTime: [{
        type: String,
        required: false
    }],
    is_deleted: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const GameTime = mongoose.model('GameTime', gameTimeSchema);

export { GameTime }