import { mongoose } from '../index.js';

const UPISchema = new mongoose.Schema({
    
    logo: {
        type: String,
        required: false
    },
    QRCode: {
        type: String,
        required: false
    },
    methodName: {
        type: String,
        required: false
    },
    UPIId: {
        type: String,
        required: false,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const UPIMethod = mongoose.model('UPIMethod', UPISchema);

export { UPIMethod };