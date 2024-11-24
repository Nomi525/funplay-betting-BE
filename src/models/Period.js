import { mongoose } from '../index.js';

const periodSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    period: {
        type: String,
        required: false,
        index: true,
    },
    date: {
        type: Date,
        required: false
    },
    startTime: {
        type: Number,
        required: false
    },
    endTime: {
        type: Number,
        required: false
    },
    // isTimeUp: {
    //     type: Boolean,
    //     required: false,
    //     default: false
    // },
    // isSlotGrater: {
    //     type: Boolean,
    //     required: false,
    //     default: false
    // },
    periodFor: {
        type: String,
        enum: ["30", "60", "80", "120", "180"],
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Period = mongoose.model('Period', periodSchema);


const periodSchemaNew = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    period: {
        type: String,
        required: false,
        index: true,
    },
    date: {
        type: Date,
        required: false
    },
    startTime: {
        type: Number,
        required: false
    },
    endTime: {
        type: Number,
        required: false
    },
    // isTimeUp: {
    //     type: Boolean,
    //     required: false,
    //     default: false
    // },
    // isSlotGrater: {
    //     type: Boolean,
    //     required: false,
    //     default: false
    // },
    periodFor: {
        type: String,
        // enum: ["30", "60", "80", "120", "180"],
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const PeriodNew = mongoose.model('PeriodNew', periodSchemaNew);

export { Period, PeriodNew };
