import { mongoose } from '../index.js';

const transactionHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    walletAddress: {
        type: String,
        required: false
    },
    networkChainId: {
        type: String,
        required: false
    },
    tokenName: {
        type: String,
        required: false
    },
    tokenAmount: {
        type: Number,
        required: false,
        default: 0,
    },
    tokenDollorValue: {
        type: Number,
        required: false,
        default: 0,
    },
    type: {
        type: String,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

export { TransactionHistory };