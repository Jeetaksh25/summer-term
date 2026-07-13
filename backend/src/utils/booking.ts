import Table from "../models/table.model.js";
import Reservation from "../models/reservation.model.js";

export const toUtcDayBounds = (dateInput: string | Date) => {
    const date = typeof dateInput === "string" ? dateInput : dateInput.toISOString().split("T")[0];
    return {
        start: new Date(`${date}T00:00:00.000Z`),
        end: new Date(`${date}T23:59:59.999Z`),
    };
};

export const timesOverlap = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    return aStart < bEnd && aEnd > bStart;
};

export const addMinutes = (time: string, mins: number) => {
    const [h, m] = time.split(":").map(Number);
    const total = h * 60 + m + mins;
    const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
    const mm = String(total % 60).padStart(2, "0");
    return `${hh}:${mm}`;
};

export const activeReservationStatuses = ["confirmed", "seated"] as const;

export const recomputeTableStatus = async (tableId: string) => {
    const active = await Reservation.find({
        table: tableId,
        status: { $in: activeReservationStatuses },
    }).lean();

    let status: "available" | "occupied" | "reserved" = "available";
    if (active.some((r) => r.status === "seated")) {
        status = "occupied";
    } else if (active.length > 0) {
        status = "reserved";
    }

    await Table.findByIdAndUpdate(tableId, { status });
    return status;
};