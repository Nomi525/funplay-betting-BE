import { mongoose } from "../index.js";

const QrCode = new mongoose.Schema({
    qrCode: {
        type: String,
        required: false
    },
    UpiID: {
        type: String,
        required: false
    },
},
    { timestamps: true }
);

const QrCodes = mongoose.model('upiQr', QrCode);

export { QrCodes }