import express from "express";
import {
    getWaitlist,
    addToWaitlist,
    seatWaitlistEntry,
    removeFromWaitlist,
} from "../controllers/waitlist.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { guestBookingLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { waitlistSchema } from "../validators/booking.validator.js";

const router = express.Router();

router.get("/", protect, restrictTo("admin", "owner", "staff"), getWaitlist);
router.post("/", guestBookingLimiter, validate(waitlistSchema), addToWaitlist);
router.patch("/:id/seat", protect, restrictTo("admin", "owner", "staff"), seatWaitlistEntry);
router.patch("/:id/cancel", removeFromWaitlist);

export default router;