import { mongoose } from "../index.js";

const walletLoginSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        walletAddress: {
            type: String,
            default: null,
        },
        walletData: {
            type: Object,
        },
    },
    { timestamps: true }
);

const WalletLogin = mongoose.model("WalletLogin", walletLoginSchema);
export { WalletLogin };
