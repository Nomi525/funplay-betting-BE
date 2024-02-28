import { mongoose } from '../index.js';

const faintCurrencySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    }, 
    amount: {
        type: Number,
        required: false
    },
    UTRId: {
        type: Number,
        required: false
    },
    transactionScreenShort: {
       type: String, 
        required: false,
        default: 0
    },
    UPIMethod: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: [ "Approved", "Pending", "Rejected"],
        default:"Pending",
        required: false
    },
    requestType : {
        type: String,
        default:'Deposit'
    },
    rejectReason :{
        type: String,
        required: false,
        default: 0
    },
    rejectScreenShort :{
        type: String,
        required: false,
        default: 0
    },
    is_deleted: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const FaintCurrency = mongoose.model('faintCurrency', faintCurrencySchema);

export { FaintCurrency };