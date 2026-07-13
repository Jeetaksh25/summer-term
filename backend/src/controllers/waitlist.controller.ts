import { Request, Response, NextFunction } from "express"
import Waitlist from "../models/waitlist.model.js"
import Table from "../models/table.model.js"
import Reservation from "../models/reservation.model.js"
import {
    toUtcDayBounds,
    timesOverlap,
    addMinutes,
    activeReservationStatuses,
    recomputeTableStatus,
} from "../utils/booking.js"

const SEAT_DURATION_MIN = 120;

export const getWaitlist = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const entries = await Waitlist.find().populate("table", "tableNumber capacity").sort({ priority: -1, createdAt: -1 });

        res.status(200).json(entries);
    } catch(error){
        console.log(error)
        next(error);
    }
}

export const addToWaitlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const entry = new Waitlist(req.body);
       await entry.save();

       res.status(201).json(entry);
    } catch (error){
        console.log(error)
        next(error);
    }
}

export const seatWaitlistEntry = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const entry = await Waitlist.findById(req.params.id);
        if(!entry){
            return res.status(404).json({ message: "Waitlist entry not found"});
        }
        if (entry.status === "seated" || entry.status === "cancelled") {
            return res.status(400).json({ message: `Entry already ${entry.status}` });
        }

        const startTime = entry.requestedTime;
        const endTime = addMinutes(startTime, SEAT_DURATION_MIN);
        const bounds = toUtcDayBounds(entry.preferredDate);

        let tableId = req.body.table as string | undefined;
        if (!tableId) {
            const candidates = await Table.find({
                isActive: true,
                status: { $ne: "maintenance" },
                capacity: { $gte: entry.partySize },
            }).sort({ capacity: 1 });

            const existing = await Reservation.find({
                date: { $gte: bounds.start, $lte: bounds.end },
                status: { $in: activeReservationStatuses },
            }).lean();

            const free = candidates.find((t) =>
                !existing.some((r) =>
                    r.table.toString() === t._id.toString() &&
                    timesOverlap(startTime, endTime, r.startTime, r.endTime)
                )
            );

            if (!free) {
                return res.status(409).json({ message: "No table available for this party and time" });
            }
            tableId = free._id.toString();
        } else {
            const tableDoc = await Table.findById(tableId);
            if (!tableDoc || !tableDoc.isActive || tableDoc.status === "maintenance") {
                return res.status(400).json({ message: "Selected table is not available" });
            }
            const conflicting = await Reservation.findOne({
                table: tableId,
                date: { $gte: bounds.start, $lte: bounds.end },
                status: { $in: activeReservationStatuses },
                $or: [
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } },
                ],
            }).lean();
            if (conflicting && timesOverlap(startTime, endTime, conflicting.startTime, conflicting.endTime)) {
                return res.status(409).json({ message: "Selected table is already booked for that time" });
            }
        }

        await Reservation.create({
            customerName: entry.customerName,
            contact: entry.contact,
            partySize: entry.partySize,
            table: tableId,
            date: entry.preferredDate,
            startTime,
            endTime,
            status: "confirmed",
        });

        await recomputeTableStatus(tableId);

        entry.status = "seated";
        entry.table = tableId as any;
        await entry.save();
        await entry.populate("table", "tableNumber capacity");

        res.status(200).json(entry);

    } catch(error){
        console.log(error);
        next(error);
    }
}


export const removeFromWaitlist = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const entry = await Waitlist.findByIdAndUpdate(req.params.id, {status: "cancelled"}, { new: true }).populate("table", "tableNumber capacity");

        if(!entry){
            return res.status(404).json({ message: "Reservation not found"});
        }

        res.status(200).json(entry);
    } catch(error){
        console.log(error);
        next(error);
    }
}