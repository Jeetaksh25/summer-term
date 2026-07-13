"use client";

import { useEffect } from "react";
import { useFunctionStore } from "@/store/functionStore";

export default function ReservationsPage() {
  const {
    reservations,
    loading,
    errors,
    selectedDate,
    fetchReservations,
    setSelectedDate,
    clearError,
  } = useFunctionStore();

  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate, fetchReservations]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Reservations</h1>
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-md border px-3 py-1.5 text-sm"
          />
          <button
            onClick={() => fetchReservations(selectedDate)}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
            disabled={loading.reservations}
          >
            {loading.reservations ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      {errors.reservations && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {errors.reservations}
          <button
            onClick={() => clearError("reservations")}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-6">
        {reservations.length === 0 ? (
          <p className="text-muted-foreground">
            No reservations for {selectedDate}. Create one to get started.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <li
                key={reservation._id}
                className="rounded-lg border bg-white p-4 dark:bg-black"
              >
                <p className="font-medium">{reservation.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {reservation.startTime}–{reservation.endTime} · Party of{" "}
                  {reservation.partySize}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {reservation.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
