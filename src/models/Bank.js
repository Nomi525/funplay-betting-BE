

  import { mongoose } from "../index.js";

const bankSchema = new mongoose.Schema(
  {
    bankName: {
        type: String,
        required: false,
      },
      branch: {
        type: String,
        required: false,
      },
      accountHolder: {
        type: String,
        required: false,
      },
      accountNumber: {
        type: Number,
        required: false,
      },
      IFSCCode: {
        type: String,
        required: false,
      },
  },
  { timestamps: true }
);

const Bank = mongoose.model("bank", bankSchema);
export { Bank };
