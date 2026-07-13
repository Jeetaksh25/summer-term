import { z } from "zod";

export const reservationSchema = z.object({
    customerName: z.string().min(2).max(100),
    contact: z.string().min(5).max(100),
    partySize: z.number().int().min(1),
    table: z.string().min(1),
    date: z.string().or(z.date()),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    notes: z.string().max(500).optional(),
});

export const waitlistSchema = z.object({
    customerName: z.string().min(2).max(100),
    contact: z.string().min(5).max(100),
    partySize: z.number().int().min(1),
    preferredDate: z.string(),
    requestedTime: z.string(),
    table: z.string().optional(),
});