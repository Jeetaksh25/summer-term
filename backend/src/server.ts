import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { connectDB } from "../config/config.js";
import { seedAdmin } from "../config/seed.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import tableRoutes from "./routes/table.route.js"
import reservationRoutes from "./routes/reservation.route.js"
import waitlistRoutes from "./routes/waitlist.route.js";
import authRoutes from "./routes/auth.route.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
const server = createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.json({ message: "DineFlow API is running" });
});

app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

server.listen(PORT, async () => {
  await connectDB();
  await seedAdmin();
  console.log(`Server running on http://localhost:${PORT}`);
});