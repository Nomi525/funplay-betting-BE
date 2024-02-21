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
    tokenValue: {
        type: String,
        required: false
    },
    tetherType: {
        type: String,
        required: false
    },
    coin: {
        type: Number,
        required: false,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'accept', 'reject'],
        default: 'pending'
    },
    is_deleted: {
        type: Number,
        required: false,
        default: 0
    },
}, { timestamps: true });

const WithdrawalRequest = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);

export { WithdrawalRequest };