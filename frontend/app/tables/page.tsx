"use client";

import { useEffect } from "react";
import { useFunctionStore } from "@/store/functionStore";

export default function TablesPage() {
  const { tables, loading, errors, fetchTables, clearError } = useFunctionStore();

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tables</h1>
        <button
          onClick={() => fetchTables()}
          className="rounded-md border px-3 py-1.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900"
          disabled={loading.tables}
        >
          {loading.tables ? "Loading…" : "Refresh"}
        </button>
      </div>

      {errors.tables && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-200">
          {errors.tables}
          <button
            onClick={() => clearError("tables")}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="mt-6">
        {tables.length === 0 ? (
          <p className="text-muted-foreground">No tables found. Add one to get started.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <li
                key={table._id}
                className="rounded-lg border bg-white p-4 dark:bg-black"
              >
                <p className="font-medium">Table {table.tableNumber}</p>
                <p className="text-sm text-muted-foreground">
                  Capacity: {table.capactiy} · {table.location} · {table.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
