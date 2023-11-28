import { mongoose } from '../index.js';

const adminSettingSchema = new mongoose.Schema(
    {
        withdrawalAmount: {
            type: Number,
            default: 0,
        },
        minimumBalance: {
            type: Number,
            default: 0,
        },
        rewardsPoints: {
            type: Number,
            default: 0,
        },
        joiningBonus: {
            type: Number,
            default: 0,
        },
        bettingPenalty: {
            type: Number,
            default: 0,
        },
        walletAddress: {
            type: String,
            required : false
        },
        oneCoinRupes: {
            type: Number,
            required : false,
            default : 0
        },
        oneRupesCoin: {
            type: Number,
            required : false,
            default : 0
        },
        currency: {
            type: String,
            required: false
        },
        currencyValue: {
            type: Number,
            required: false
        },
        coin: {
            type: Number,
            required: false
        },
        is_deleted: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const AdminSetting = mongoose.model("AdminSetting", adminSettingSchema);
export { AdminSetting }
