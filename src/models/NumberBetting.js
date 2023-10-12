import { mongoose } from "./../index.js"

const numberBettingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    number: {
        type: Number,
        required: false
    },
    betAmount: {
        type: Number,
        required: false
    },
    totalAmount: {
        type: Number,
        required: false
    },
    winAmount: {
        type: Number,
        required: false,
        default: 0
    },
    lossAmount: {
        type: Number,
        required: false,
        default: 0
    },
    isWin : {
        type: Boolean,
        required: false,
        default: false
    },
    is_deleted: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

const NumberBetting = mongoose.model('NumberBetting', numberBettingSchema)
export { NumberBetting }