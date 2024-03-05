import { mongoose } from '../index.js';

const coinSettingSchema = new mongoose.Schema({
    currency: {
        type: String,
        required: false
    },
    currencyValue: {
        type: Number,
        required: false
    },
    coin: {
        type: Number,
        required: false
    }, 
    isActive: {
        type: Boolean,
        required: false,
        default: true
    },
    is_deleted: {
        type: Number,
        default : 0 
    },
}, { timestamps: true });

const CoinSetting = mongoose.model('CoinSetting', coinSettingSchema);

export { CoinSetting };