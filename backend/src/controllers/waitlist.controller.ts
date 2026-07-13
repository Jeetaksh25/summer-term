import { Request, Response, NextFunction } from "express"
import Waitlist from "../models/waitlist.model.js"

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
        const entry = await Waitlist.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("table", "tableNumber capacity");

        if(!entry){
            return res.status(404).json({ message: "Reservation not found"});
        }

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

