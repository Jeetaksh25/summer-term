import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
    customerName: { 
        type: String, 
        required: true 
    },
    contact: { 
        type: String, 
        required: true 
    },
    partySize: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    preferredDate: { 
        type: String, 
        required: true 
    },
    requestedTime: { 
        type: String, 
        required: true 
    },
    status: {
        type: String,
        enum: ["waiting", "notified", "seated", "cancelled", "expired"],
        default: "waiting",
    },
    priority: { type: Number, 
        default: 0 
    },
    table: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Table" 
    },
}, { timestamps: true });

waitlistSchema.index({ status: 1, createdAt: 1 });

export const Waitlist = mongoose.model("Waitlist", waitlistSchema);
export default Waitlist;