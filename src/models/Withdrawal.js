import { mongoose } from '../index.js';

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    email: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    requestedAmount: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        enum: ["Fiat Currency", "Crypto Currency"],
        required: false
    },
    tokenName: {
        type: String,
        enum: ["Bitcoin", "BNB", "Polygon", "Ethereum"],
        required: false
    },
    walletAddress: {
        type: String,
        required: false
    },
    bitcoinWalletAddress: {
        type: String,
        required: false
    },
    ethereumWalletAddress: {
        type: String,
        required: false
    },
    networkChainId: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ["Approved", "Rejected", "Pending"],
        default: 'Pending'
    },
    requestType: {
        type: String,
        default: 'Withdrawal'
    },
    currency: {
        type: String,
        required: false
    },
    rejectReason: {
        type: String,
        required: false,
        default: 0
    },
    is_deleted: {
        type: Number,
        required: false,
        default: 0
    },
    withdrawalApproveImg:{
        type: String,
        required: false,
        default: 0
    },
}, { timestamps: true });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export { Withdrawal };