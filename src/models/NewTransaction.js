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
    networkChainId : { 
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
    tokenDollorValue: {
        type: Number,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const NewTransaction = mongoose.model('NewTransaction', newTransactionSchema);

export { NewTransaction };