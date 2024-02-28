import { mongoose } from '../index.js';

const ratingSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    rating: {
        type: Number,
        required: false
    },
    is_deleted : {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);

export { Rating };