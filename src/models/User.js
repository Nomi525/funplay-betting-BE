import { mongoose } from "../index.js";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      default: null
    },
    userName: {
      type: String,
      required: false,
    },
    mobileNumber: {
      type: String,
      Unique: true,
    },
    referralCode: {
      type: String,
      required: false,
    },
    referralByCode: {
      type: String,
      required: false,
    },
    // referralUser: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: false,
    //   },
    // ],
    mPin: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordAllow: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: Number,
      default: null,
    },
    forgotOtp: {
      type: Number,
      default: null,
    },
    profile: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    wallet: [
      {
        walletAddress: {
          type: String,
          required: false,
        },
        walletType: {
          type: String,
          required: false,
          enum: ["web3model", "magic"],
        },
        isConnected: {
          type: Boolean,
          required: false,
          default: false,
        },
      },
    ],
    walletConnected: {
      type: String,
      required: false,
      default: "No",
    },
    bankDetails:[ {
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
    }],
    currency: {
      type: String,
      required: false,
    },
    registerType: {
      type: String,
      required: false,
      enum: ["OTP", "Password"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    country: {
      type: String,
      required: false,
    },
    countryCode: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export { User };
