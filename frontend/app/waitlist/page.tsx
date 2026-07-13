"use client";

import { useEffect } from "react";
import { useFunctionStore } from "@/store/functionStore";

export default function WaitlistPage() {
  const { waitlist, loading, errors, fetchWaitlist, clearError } = useFunctionStore();

  useEffect(() => {
    fetchWaitlist();
  }, [fetchWaitlist]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Waitlist</h1>
        <button
          onClick={() => fetchWaitlist()}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
          disabled={loading.waitlist}
        >
          {loading.waitlist ? "Loading…" : "Refresh"}
        </button>
      </div>

      {errors.waitlist && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {errors.waitlist}
          <button
            onClick={() => clearError("waitlist")}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-6">
        {waitlist.length === 0 ? (
          <p className="text-muted-foreground">
            No waitlist entries. Add one to get started.
          </p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {waitlist.map((entry) => (
              <li
                key={entry._id}
                className="rounded-lg border bg-white p-4 dark:bg-black"
              >
                <p className="font-medium">{entry.customerName}</p>
                <p className="text-sm text-muted-foreground">
                  {entry.preferredDate} at {entry.requestedTime} · Party of{" "}
                  {entry.partySize}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                  {entry.status} · Priority {entry.priority}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
