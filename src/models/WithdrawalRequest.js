import { mongoose } from '../index.js';

const withdrawalRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    walletAddress: {
        type: String,
        required: false
    },
    tokenName: {
        type: String,
        required: false
    },
    tokenAmount: {
        type: Number,
        required: false
    },
    status : {
        type : String,
        enum : ['pendding','accept','reject'],
        default : 'pendding'
    },
    is_deleted: {
        type: Number,
        required: false,
        default : 0
    },
}, { timestamps: true });

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

export { WithdrawalRequest };