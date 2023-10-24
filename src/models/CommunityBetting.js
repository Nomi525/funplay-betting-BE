import { mongoose } from "./../index.js"

const communityBettingSchema = new mongoose.Schema({
    communityImage: {
        type: String,
        required: false
    },
    startDate: {
        type: String,
        required: false
    },
    endDate: {
        type: String,
        required: false
    },
    gameRounds: {
        type: String,
        required: false,
        default: 0
    },
    winningAmount: {
        type: String,
        required: false,
        default: 0
    },
    noOfWinners: {
        type: Number,
        required: false,
        default: 0
    },
    winner1: {
        type: String,
        required: false
    },
    winner2: {
        type: String,
        required: false
    },
    winner3: {
        type: String,
        required: false
    },
    winner4: {
        type: String,
        required: false
    },
    gameFromTime: {
        type: String,
        required: false
    },
    gameToTime: {
        type: String,
        required: false
    },
    gameMode: {
        type: String,
        required: false
    },
    gameMinimumCoin: {
        type: Number,
        required: false,
        default: 0
    },
    gameMaximumCoin: {
        type: Number,
        required: false,
        default: 0
    },
    is_deleted: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

const CommunityBetting = mongoose.model('CommunityBetting', communityBettingSchema)
export { CommunityBetting }