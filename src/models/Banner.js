import { mongoose } from "../index.js";


const bannerSchema = new mongoose.Schema({
    bannerName: { type: String, required: false },
    bannerDescription: { type: String, required: false },
    bannerImage: { type: String, required: false },
    type: { type: String, required: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    is_deleted: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const BannerModel = mongoose.model('BannerModel', bannerSchema);

export { BannerModel }