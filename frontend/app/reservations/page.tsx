"use client";

import { useEffect, useState } from "react";
import { useFunctionStore } from "@/store/functionStore";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input, Select, Textarea } from "@/components/ui/input";
import { toast } from "sonner";
import { AnimatedSection } from "@/components/ui/animated-section";

export default function BookReservationPage() {
  const { tables, loading, errors, fetchTables, createReservation, clearError } = useFunctionStore();

  const [form, setForm] = useState({
    customerName: "",
    contact: "",
    partySize: 1,
    table: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    notes: "",
  });

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError("mutation");
    const result = await createReservation({
      ...form,
      partySize: Number(form.partySize),
      table: form.table,
    });
    if (result) {
      toast.success("Reservation requested successfully");
      setForm({
        customerName: "",
        contact: "",
        partySize: 1,
        table: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        notes: "",
      });
    } else {
      toast.error(errors.mutation || "Failed to create reservation");
    }
  };

  return (
    <>
      <PageHeader
        title="Book a table"
        description="Reserve a table for your party. We will confirm your booking right away."
      />

      <Container className="pb-20">
        <AnimatedSection className="mx-auto max-w-3xl">
          <Card>
            <CardContent className="p-6 md:p-8">
              {errors.mutation && (
                <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {errors.mutation}
                  <button onClick={() => clearError("mutation")} className="ml-2 underline">Dismiss</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Name</Label>
                    <Input
                      id="customerName"
                      type="text"
                      required
                      value={form.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Phone or email</Label>
                    <Input
                      id="contact"
                      type="text"
                      required
                      value={form.contact}
                      onChange={(e) => handleChange("contact", e.target.value)}
                      placeholder="How we reach you"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="partySize">Party size</Label>
                    <Input
                      id="partySize"
                      type="number"
                      min={1}
                      required
                      value={form.partySize}
                      onChange={(e) => handleChange("partySize", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="table">Table</Label>
                    <Select
                      id="table"
                      required
                      value={form.table}
                      onChange={(e) => handleChange("table", e.target.value)}
                    >
                      <option value="" disabled>Select a table</option>
                      {tables.map((table) => (
                        <option key={table._id} value={table._id}>
                          Table {table.tableNumber} (Capacity {table.capactiy})
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      required
                      value={form.startTime}
                      onChange={(e) => handleChange("startTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      required
                      value={form.endTime}
                      onChange={(e) => handleChange("endTime", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    placeholder="Allergies, special occasion, seating preference"
                  />
                </div>

                <Button type="submit" disabled={loading.mutation} className="w-full">
                  {loading.mutation ? "Booking…" : "Book table"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </AnimatedSection>
      </Container>
    </>
  );
}
