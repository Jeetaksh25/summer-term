import express from "express";
import {
    getReservation,
    getAvailability,
    createReservation,
    updateReservation,
    cancelReservation,
} from "../controllers/reservation.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { guestBookingLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { reservationSchema } from "../validators/booking.validator.js";

const router = express.Router();

router.get("/availability", getAvailability);
router.get("/", protect, restrictTo("admin", "owner", "staff"), getReservation);
router.post("/", guestBookingLimiter, validate(reservationSchema), createReservation);
router.put("/:id", protect, restrictTo("admin", "owner", "staff"), updateReservation);
router.patch("/:id/cancel", protect, restrictTo("admin", "owner", "staff"), cancelReservation);

export default router;