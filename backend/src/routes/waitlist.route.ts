import express from 'express';
import { getWaitlist, addToWaitlist, removeFromWaitlist, seatWaitlistEntry } from '../controllers/waitlist.controller.js';

const router = express.Router();

router.get("/", getWaitlist);
router.post("/", addToWaitlist);
router.patch("/:id/seat", seatWaitlistEntry);
router.patch("/:id/cancel", removeFromWaitlist);

export default router;