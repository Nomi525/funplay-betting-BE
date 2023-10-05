import mongoose from "mongoose";


const PermissionSchema = new mongoose.Schema(
    {
        RoleType: {
            type: String,
            required: false,
        },
        Status: {
            type: Boolean,
            default: false,
        },
        Game: {
            all: {
                type: Boolean,
                default: false,
                required: false
            },
            create: {
                type: Boolean,
                default: false,
                required: false
            },
            update: {
                type: Boolean,
                default: false,
                required: false
            },
            View: {
                type: Boolean,
                default: false,
                required: false
            },
            delete: {
                type: Boolean,
                default: false,
                required: false
            },
        },
        isActive: {
            type: Boolean,
            default: true,
            required: false
        },
        is_deleted: {
            type: Number,
            default: 0,
            required: false
        },
    },
    {
        timestamps: true,
    }
);


export const Permission = mongoose.model("permission", PermissionSchema);