import express from "express";
import {
    getTables,
    createTable,
    updateTable,
    deleteTable,
} from "../controllers/table.controller.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getTables);
router.post("/", protect, restrictTo("admin", "owner", "staff"), createTable);
router.put("/:id", protect, restrictTo("admin", "owner", "staff"), updateTable);
router.delete("/:id", protect, restrictTo("admin", "owner", "staff"), deleteTable);

export default router;