import { mongoose } from '../index.js';

const CMS_Schema = new mongoose.Schema(
    {
        privacyPolicy: {
            description: {
                type: String,
                require: false,
            },
            title: {
                type: String,
                require: false,
            },
        },
        contactUs: {
            description: {
                type: String,
                require: false,
            }, title: {
                type: String,
                require: false,
            },
        },
        aboutUs: {
            description: {
                type: String,
                require: false,
            }, title: {
                type: String,
                require: false,
            },
        },
        termsAndCondition: {
            description: {
                type: String,
                require: false,
            }, title: {
                type: String,
                require: false,
            },
        },
        deletedStatus: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    { timestamps: true }
);
const CMS_Model = mongoose.model("CMS", CMS_Schema);
export { CMS_Model };