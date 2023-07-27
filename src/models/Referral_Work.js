import { mongoose } from '../index.js';

const Referral_Work_Schema = new mongoose.Schema(
    {
        referralWork : []
    },
    { timestamps: true }
);
const Referral_Work = mongoose.model("Referral_Work", Referral_Work_Schema);
export { Referral_Work };