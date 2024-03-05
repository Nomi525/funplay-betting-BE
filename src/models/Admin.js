import { mongoose } from "../index.js";

const adminSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      Unique: true,
      lowercase: true,
    },
    mobileNumber: {
      type: Number,
      required: false,
    },
    password: {
      type: String,
      required: true,
    },
    isLogin: {
      type: Boolean,
      default: false,
    },
    resetPasswordAllow: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
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
    // role: {
    //     type: String,
    //     enum: ['admin', 'subadmin'],
    //     default: 'subadmin',
    //     required: false,
    // },
    deviceId: {
      type: String,
      required: false,
    },
    ipAddress: {
      type: String,
      required: false,
    },
    deviceName: {
      type: String,
      required: false,
    },
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Permission",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    is_deleted: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
export { Admin };
