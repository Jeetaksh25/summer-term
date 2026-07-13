import { Request, Response, NextFunction } from "express";
import Reservation from "../models/reservation.model.js";

export const getReservation = async (req: Request, res: Response, 
next: NextFunction) => {
    try {
        const date = req.query.date as string | undefined;
        const filter = date ? { date } : {};

        const reservations = (await Reservation.find(filter).populate("table", "tableNumber capacity")).sort((a, b) => a.startTime.localeCompare(b.startTime));

        res.status(200).json(reservations);
    } catch (error){
        console.log(error);
        next(error);
    }
}

export const createReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
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