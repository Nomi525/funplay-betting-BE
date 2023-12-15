import { mongoose } from '../index.js';

const periodSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    period: {
        type: Number,
        required: false,
        index: true,
        unique: true
    },
    date: {
        type: Date,
        required: false
    },
    startTime: {
        type: String,
        required: false
    },
    endTime: {
        type: String,
        required: false
    },
    isTimeUp: {
        type: Boolean,
        required: false,
        default: false
    },
    isSlotGrater: {
        type: Boolean,
        required: false,
        default: false
    },
    periodFor: {
        type: String,
        enum: ["30", "60", "120"],
        required: false,
        default: "30"
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Period = mongoose.model('Period', periodSchema);

export { Period };