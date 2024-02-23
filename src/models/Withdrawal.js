import { mongoose } from '../index.js';

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    email:{
        type : String,
        required: false
    },
    requestedAmount: {
        type: Number,
        required: false
    },
    type : {
        type : String,
        enum : ['cryptocurrency','fiatcurrency'],
        required: false
    },
    bitcoinWalletAddress:{
        type : String,
        required: false
    }, 
    ethereumWalletAddress:{
        type : String,
        required: false
    },
    networkChainId:{
        type : String,
        required: false
    },
    status : {
        type : String,
        enum : ['pending','accept','reject'],
        default : 'pending'
    },
    rejectReason :{
        type : String,
        required: false,
        default:0
    },
    is_deleted: {
        type: Number,
        required: false,
        default : 0
    },
}, { timestamps: true });

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

export { Withdrawal};