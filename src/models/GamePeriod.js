import { mongoose } from "../index.js";


const gamePeriodSchema = new mongoose.Schema({
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
    period: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: false
    },
    colorName: {
        type: String,
        required: false
    },
    result: {
        type: Number,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const GamePeriod = mongoose.model('GamePeriod', gamePeriodSchema);

export { GamePeriod }