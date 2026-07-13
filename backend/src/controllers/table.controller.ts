import { Request, Response, NextFunction } from "express";
import Table from "../models/table.model.js";

export const getTables = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tables = await Table.find().sort({ createdAt: -1});
        res.status(200).json(tables);
    } catch (error){
        console.log(error);
        next(error);
    }
}

export const createTable = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const table = new Table(req.body);
        await table.save();
        res.status(201).json(table);
    } catch (error){
        console.log(error);
        next(error);
    }
}

export const updateTable = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true});

        if (!table){
            return res.status(404).json({ message: "Table not found"});
        }

        res.status(200).json(table);
    } catch (error){
        console.log(error);
        next(error);
    }
} 

export const deleteTable = async (req: Request, res: Response, next:
    NextFunction) => {
    try{
        const table = await Table.findByIdAndDelete(req.params.id);

        if (!table){
            return res.status(404).json({ message: "Table not found"});
        }

        res.status(200).json({ message: "Table deleted"});
    } catch (error){
        console.log(error);
        next(error);
    }
}
