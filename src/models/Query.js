import { mongoose } from '../index.js';

const querySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        userName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: false
        },
        mobileNumber: {
            type: Number,
            required: false
        },
        description: {
            type: String,
            required: false
        },
        queryDocument: {
            type: String,
            required: false
        },
        is_deleted: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);
const Query = mongoose.model("Query", querySchema);
export { Query };