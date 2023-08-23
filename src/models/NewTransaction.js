import { mongoose } from '../index.js';

const newTransactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    walletAddress : { 
        type: String, 
        required: false 
    },
    bitcoinWalletAddress : {
        type: Array, 
        required: false 
    },
    ethereumWalletAddress : {
        type: Array, 
        required: false 
    },
    networkChainId : { 
        type: String, 
        required: false 
    },
    tokenBitcoin: { 
        type: Number,
        required: false 
    },
    tokenTether: { 
        type: Number,
        required: false 
    },
    tokenBNB: { 
        type: Number,
        required: false 
    },
    tokenPolygon: {
        type: Number,
        required: false 
    },
    tokenDollorValue: {
        type: Number,
        required: false,
        default: 0,
    },
    blockDollor : {
        type: Number,
        required: false,
        default: 0,
    },
    blockAmount : {
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