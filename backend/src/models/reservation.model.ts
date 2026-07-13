import { truncate } from "fs";
import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    partySize: {
        type: Number,
        required: true,
        min: 1
    },
    table: {
        type: mongoose.Schema.Types.ObjectId, ref: "Table",
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["confirmed", "seated", "completed", "cancelled", "no-show"],
        default: "confirmed"
    },
    notes: {
        type: String,
        default: ""
    }
}, {timestamps: true})


reservationSchema.index({ date: 1, startTime: 1, table: 1});

export const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;