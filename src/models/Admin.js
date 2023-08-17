import { mongoose } from '../index.js';

const adminSchema = new mongoose.Schema(
    {
        firsName: {
            type: String,
            required: false,
        },
        lastName: {
            type: String,
            required: false,
        },
        email: {
            type: String,
            Unique: true,
        },
        mobileNumber: {
            type: Number,
            required: false,
        },
        password: {
            type: String,
            required: true,
        },
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
        address: {
            type: String,
            required: false,
        },
        is_deleted: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export { Admin }
