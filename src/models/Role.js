import { mongoose } from '../index.js';

const roleSchema = new mongoose.Schema({
    roleName: {
        type: String,
        required: false
    },
    permission: {
        edit: {
            type: Boolean,
            default: false,
            required: false,
        },
        delete: {
            type: Boolean,
            default: false,
            required: false,
        },
        create: {
            type: Boolean,
            default: false,
            required: false,
        },
    },
    permissionType: [{
        type: String,
        required: false,
    }],
    isActive: {
        type: Boolean,
        required: false,
        default: true,
    },
    is_deleted: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

export { Role };