import { mongoose } from "../index.js";

const referraluserSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    referralUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    referralByCode: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const ReferralUser = mongoose.model("ReferralUser", referraluserSchema);
export { ReferralUser };
