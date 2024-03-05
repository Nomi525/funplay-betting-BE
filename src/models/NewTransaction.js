import { mongoose } from '../index.js';

const newTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    walletAddress : { 
        type: String, 
        required: false,
        default:0
    },
    bitcoinWalletAddress : {
        type: Array, 
        required: false,
        default:0 
    },
    ethereumWalletAddress : {
        type: Array, 
        required: false,
        default:0 
    },
    networkChainId : { 
        type: String, 
        required: false,
        default:0 
    },
    tokenBitcoin: { 
        type: String,
        required: false,
        default: 0,
    },
    tokenBNB: { 
        type: String,
        required: false,
        default: 0,
    },
    tokenBUSD: { 
        type: String,
        required: false,
        default: 0,
    },
    tokenEthereum: {
        type: String,
        required: false,
        default: 0,
    },
    tokenEthereumUSDT: {
        type: String,
        required: false,
        default: 0,
    },
    tokenPolygon: {
        type: String,
        required: false,
        default: 0,
    },
    tokenPolygonUSDT: {
        type: String,
        required: false,
        default: 0,
    },
    tokenDollorValue: {
        type: String,
        required: false,
        default: 0,
    },
    blockDollor : {
        type: String,
        required: false,
        default: 0,
    },
    blockAmount : {
        type: String,
        required: false,
        default: 0,
    },
    betAmount : {
        type: String,
        required: false,
        default: 0,
    },
    totalCoin : {
        type: Number,
        required: false,
        default: 0,
    },
    blockCoin : {
        type: Number,
        required: false,
        default: 0,
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const NewTransaction = mongoose.model('NewTransaction', newTransactionSchema);

export { NewTransaction };