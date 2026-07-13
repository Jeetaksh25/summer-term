import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const error = result.error as ZodError;
            const errors = error.issues.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            return res.status(400).json({ message: "Validation failed", errors });
        }
        req.body = result.data;
        next();
    };
};