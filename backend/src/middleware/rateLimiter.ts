import rateLimit from "express-rate-limit";

export const guestBookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many booking attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
});