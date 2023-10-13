import { mongoose } from "../index.js";


const currencyCoinSchema = new mongoose.Schema({
    currencyName: {
        type: String,
        required: false
    },
    coin: {
        type: Number,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const CurrencyCoin = mongoose.model('CurrencyCoin', currencyCoinSchema);

export { CurrencyCoin }