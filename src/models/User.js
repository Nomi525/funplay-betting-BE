import { mongoose } from '../index.js';

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            Unique: true,
        },
        userName: {
            type: String,
            required: false,
        },
        mobileNumber: {
            type: Number,
            Unique: true,
        },
        referralCode: {
            type: String,
            required: false,
        },
        referralByCode: {
            type: String,
            required: false
        },
        useReferralCodeUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: false
            }
        ],
        mPin: {
            type: Number,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        isLogin: {
            type: Boolean,
            default: false
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        resetPasswordAllow: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: Number,
            default: null,
        },
        forgotOtp: {
            type: Number,
            default: null,
        },
        profile: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        walletAddress: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: false
        },
        is_deleted: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export { User }
