import { mongoose } from "../index.js";

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0 },
},
    { timestamps: true }
);

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true }, // 'deposit' or 'withdraw'
    date: { type: Date, default: Date.now },
    isRequest: { type: String, enum: [null, "pendding", "approve", "reject"], default: null }
},
    { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

export { Wallet, Transaction }