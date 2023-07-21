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
        mobileNumber: {
            type: Number,
            Unique: true,
        },
        // password: {
        //     type: String,
        //     required: true,
        // },
        isLogin: {
            type: Boolean,
            default: true,
        },
        resetPasswordAllow: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: String,
            default: null,
        },
        profile: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: false
        },
        steps: {
            type: Number,
            default: 0,
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
