import { mongoose } from '../index.js';

const referralWorkSchema = new mongoose.Schema(
    {
        referralWork : []
    },
    { timestamps: true }
);
const ReferralWork = mongoose.model("ReferralWork", referralWorkSchema);
export { ReferralWork };