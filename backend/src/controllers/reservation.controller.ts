import { Request, Response, NextFunction } from "express";
import Reservation from "../models/reservation.model.js";

const toUtcDayBounds = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? dateInput : dateInput.toISOString().split("T")[0];
    return {
        start: new Date(`${date}T00:00:00.000Z`),
        end: new Date(`${date}T23:59:59.999Z`),
    };
};

const timesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    return aStart < bEnd && aEnd > bStart;
};

export const getReservation = async (req: Request, res: Response,
next: NextFunction) => {
    try {
        const date = req.query.date as string | undefined;
        const filter = date ? { date: { $gte: toUtcDayBounds(date).start, $lte: toUtcDayBounds(date).end } } : {};

        const reservations = (await Reservation.find(filter).populate("table", "tableNumber capacity")).sort((a, b) => a.startTime.localeCompare(b.startTime));

        res.status(200).json(reservations);
    } catch (error){
        console.log(error);
        next(error);
    }
}

export const getAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const date = req.query.date as string | undefined;
        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }
        const bounds = toUtcDayBounds(date);
        const reservations = await Reservation.find({
            date: { $gte: bounds.start, $lte: bounds.end },
            status: { $nin: ["cancelled", "no-show"] },
        }).select("table startTime endTime").lean();

        const slots = reservations.map((r) => ({
            table: r.table.toString(),
            startTime: r.startTime,
            endTime: r.endTime,
        }));

        res.status(200).json(slots);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { table, date, startTime, endTime } = req.body;
        const bounds = toUtcDayBounds(date);
        const existing = await Reservation.find({
            table,
            date: { $gte: bounds.start, $lte: bounds.end },
        }).lean();

        const overlaps = existing.some((r) =>
            timesOverlap(startTime, endTime, r.startTime, r.endTime)
        );

        if (overlaps) {
            return res.status(409).json({ message: "This table is already reserved for the selected date and time" });
        }

        const reservation = new Reservation(req.body);
        await reservation.save();
        await reservation.populate("table", "tableNumber capacity");

        res.status(201).json(reservation);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updateReservation = async (req: Request, res: Response,next: NextFunction) => {
    try{
        const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("table", "tableNumber capacity");

        if(!reservation){
            return res.status(404).json({ message: "Reservation not found"});
        }

        res.status(200).json(reservation);

    } catch(error){
        console.log(error)
        next(error);
    }
}

export const cancelReservation = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const reservation = await Reservation.findByIdAndDelete(req.params.id).populate("table", "tableNumber capacity");

        if(!reservation){
            return res.status(404).json({ message: "Reservation not found"});
        }

        res.status(200).json(reservation);

    } catch(error){
        console.log(error)
        next(error);
    }
}