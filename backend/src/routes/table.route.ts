import express from "express";
import {
    getTables,
    createTable,
    updateTable,
    deleteTable,
} from "../controllers/table.controller.js"

const router = express.Router();

router.get("/", getTables);
router.post("/", createTable);
router.put("/:id", updateTable);
router.delete("/:id", deleteTable);

export default router;