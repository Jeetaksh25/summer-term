import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(( err as any).status  || 500).json({ message: err.message || "Internal Server Error" });
    next();
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ message: "Not Found" });
    next();
}