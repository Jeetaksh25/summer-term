import express from "express";
import { getReservation, createReservation, updateReservation, cancelReservation } from "../controllers/reservation.controller.js";

const router = express.Router();

router.get("/", getReservation);
router.post("/", createReservation);
router.put("/:id", updateReservation);
router.patch("/:id/cancel", cancelReservation);

export default router;