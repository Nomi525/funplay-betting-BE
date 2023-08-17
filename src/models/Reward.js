import { mongoose } from '../index.js';

const rewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    name: { 
        type: String, 
        required: false 
    },
    points: { 
        type: Number, 
        required: false 
    },
    redeemed: {
        type: Number,
        required: false,
        default: 0
    },
    description: {
        type: String,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Reward = mongoose.model('Reward', rewardSchema);

export { Reward };