import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true,
        min: 1,
    },
    capactiy:{
        type: Number,
        required: true,
        min: 1
    },
    location:{
        type: String,
        default: "indoor"
    },
    status: {
        type: String,
        enum: ["available", "occupied", "reserved", "maintenance"],
        default: "available"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const Table = mongoose.model("Table", tableSchema);
export default Table