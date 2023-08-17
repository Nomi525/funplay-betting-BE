import { mongoose } from '../index.js';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    networkChainId : { 
        type: String, 
        required: false 
    },
    networkType: { 
        type: String, 
        required: false 
    },
    hashKey: {
        type: String,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export { Transaction };