import { mongoose } from '../index.js';

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

export { Notification };