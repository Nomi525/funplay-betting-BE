import { mongoose } from "../index.js";

const walletSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 0 },
},
    { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);

export { Wallet }