import { mongoose } from "../index.js";

const faintCurrencySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    amount: {
      type: Number,
      required: false,
    },
    UTRId: {
      type: String,
      required: false,
    },
    transactionScreenShort: {
      type: String,
      required: false,
      default: 0,
    },
    UPIMethod: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Pending",
      required: false,
    },
    requestType: {
      type: String,
      enum: ["Deposit", "credit"],
      default: "Deposit",
    },
    rejectReason: {
      type: String,
      required: false,
      default: 0,
    },
    rejectScreenShort: {
      type: String,
      required: false,
      default: 0,
    },
    mobileNumber: {
      type: String,
      required: false,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const FaintCurrency = mongoose.model("faintCurrency", faintCurrencySchema);

export { FaintCurrency };
