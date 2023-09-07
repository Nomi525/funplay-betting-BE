import { mongoose } from '../index.js';

const roleSchema = new mongoose.Schema({
    roleName: { 
        type: String, 
        required: false 
    },
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