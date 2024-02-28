import { mongoose } from "../index.js";


const currencySchema = new mongoose.Schema({
    currencyName: {
        type: String,
        required: false
    },
    currencyCode: {
        type: String,
        required: false
    },
    currencySymbol: {
        type: String,
        required: false
    },
    is_deleted: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);

const Currency = mongoose.model('Currency', currencySchema);

export { Currency }