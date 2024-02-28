import { mongoose } from '../index.js';

const userNotificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "User",
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_viewed: {
        type: Boolean,
        defauls: false
    }
}, { timestamps: true });

const UserNotification = mongoose.model('UserNotifications', userNotificationSchema);

export { UserNotification }