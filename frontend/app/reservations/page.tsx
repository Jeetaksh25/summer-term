"use client";

import { useEffect, useMemo, useState } from "react";
import { useFunctionStore } from "@/store/functionStore";
import { Table, Reservation } from "@/types";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ClockIcon, UsersIcon, MapPinIcon, UtensilsIcon, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { AnimatedSection, SplitText } from "@/components/ui/animated-section";

const LOCATIONS = [
  { value: "indoor", label: "Indoor" },
  { value: "outdoor", label: "Outdoor" },
  { value: "balcony", label: "Balcony" },
];

export default function BookReservationPage() {
  const { tables, availability, loading, errors, fetchTables, fetchAvailability, createReservation, setSelectedTable, clearError } = useFunctionStore();

  const [form, setForm] = useState({
    customerName: "",
    contact: "",
    partySize: "",
    location: "",
    table: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "",
    endTime: "",
    notes: "",
  });

  const [preselectedTable, setPreselectedTable] = useState<Table | null>(null);
  const [booked, setBooked] = useState<Reservation | null>(null);

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

  useEffect(() => {
    fetchAvailability(form.date);
  }, [form.date, fetchAvailability]);

  useEffect(() => {
    const { selectedTable } = useFunctionStore.getState();
    if (!selectedTable) return;
    const match = tables.find((t) => t._id === selectedTable._id);
    if (!match) return;
    const partySize = String(Math.min(2, match.capacity));
    setPreselectedTable(match);
    setForm((prev) => ({
      ...prev,
      partySize,
      location: match.location,
      table: match._id,
    }));
    setSelectedTable(null);
  }, [tables, setSelectedTable]);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const partySizeNum = useMemo(() => {
    const n = Number(form.partySize);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [form.partySize]);

  const reservedTableIds = useMemo(() => {
    if (!form.startTime || !form.endTime) return new Set<string>();
    return new Set(
      availability
        .filter((slot) =>
          slot.startTime < form.endTime &&
          slot.endTime > form.startTime
        )
        .map((slot) => slot.table)
    );
  }, [availability, form.startTime, form.endTime]);

  const eligibleTables = useMemo(() => {
    if (!partySizeNum) return [];
    return tables
      .filter((table) => {
        const fitsParty = table.capacity >= partySizeNum;
        const isAvailable = table.status === "available";
        const matchesLocation = form.location ? table.location === form.location : true;
        const isReserved = reservedTableIds.has(table._id);
        return fitsParty && isAvailable && matchesLocation && !isReserved;
      })
      .sort((a, b) => a.capacity - b.capacity);
  }, [tables, partySizeNum, form.location, reservedTableIds]);

  useEffect(() => {
    if (form.table && !eligibleTables.some((t) => t._id === form.table)) {
      setForm((prev) => ({ ...prev, table: "" }));
    }
  }, [eligibleTables, form.table]);

  const currentTable = useMemo(
    () => tables.find((t) => t._id === form.table),
    [tables, form.table]
  );

  const locationLabel = useMemo(() => {
    if (!partySizeNum) return "Select party size first";
    return "Select area";
  }, [partySizeNum]);

  const tableLabel = useMemo(() => {
    if (!partySizeNum) return "Select party size first";
    if (!form.location) return "Select area first";
    if (eligibleTables.length === 0) return "No tables available";
    return "Select a table";
  }, [partySizeNum, form.location, eligibleTables.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError("mutation");
    if (!form.table) {
      toast.error("Please select a table that fits your party size and area");
      return;
    }
    const result = await createReservation({
      ...form,
      partySize: partySizeNum,
      table: form.table,
    });
    if (result) {
      toast.success("Reservation requested successfully");
      setBooked(result);
      fetchAvailability(form.date);
      setForm({
        customerName: "",
        contact: "",
        partySize: "",
        location: "",
        table: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        notes: "",
      });
      setPreselectedTable(null);
    } else {
      toast.error(errors.mutation || "Failed to create reservation");
    }
  };

  const handleNewBooking = () => {
    setBooked(null);
  };

  return (
    <>
      <PageHeader
        title="Book a table"
        description="Reserve a table for your party. We will confirm your booking right away"
      />

      <Container className="pb-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_360px]">
          <AnimatedSection>
            {booked ? (
              <Card className="overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <CalendarIcon className="size-8" strokeWidth={1.5} />
                  </div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight">Reservation confirmed</h2>
                  <p className="mt-2 text-muted-foreground">
                    We have received your request for {booked.partySize} guests on {booked.date} at {booked.startTime}.
                  </p>
                  <div className="mt-8 rounded-2xl border border-foreground/5 bg-secondary/40 p-6">
                    <dl className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Guest</dt>
                        <dd className="mt-1 font-medium">{booked.customerName}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Contact</dt>
                        <dd className="mt-1 font-medium">{booked.contact}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Date & time</dt>
                        <dd className="mt-1 font-medium">{booked.date} · {booked.startTime}–{booked.endTime}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-mono uppercase tracking-wide text-muted-foreground">Table</dt>
                        <dd className="mt-1 font-medium">
                          {typeof booked.table === "string"
                            ? `Table ${tables.find((t) => t._id === booked.table)?.tableNumber || ""}`
                            : `Table ${booked.table.tableNumber}`}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Button onClick={handleNewBooking} className="mt-8 h-12 w-full gap-2 rounded-full">
                    Make another reservation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="overflow-hidden">
                <CardContent className="p-8 md:p-10">
                  {errors.mutation && (
                    <div className="mb-8 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                      {errors.mutation}
                      <button onClick={() => clearError("mutation")} className="ml-2 underline">Dismiss</button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-5">
                      <SplitText className="text-sm font-mono uppercase tracking-[0.22em] text-primary">
                        Guest details
                      </SplitText>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2.5">
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
                        <div className="space-y-2.5">
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
                    </div>

                    <div className="space-y-5">
                      <SplitText className="text-sm font-mono uppercase tracking-[0.22em] text-primary" delay={0.05}>
                        Table & party
                      </SplitText>
                      <div className="grid gap-5 sm:grid-cols-3">
                        <div className="space-y-2.5">
                          <Label htmlFor="partySize" className="flex items-center gap-2">
                            <UsersIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                            Party size
                          </Label>
                          <Input
                            id="partySize"
                            type="number"
                            min={1}
                            required
                            value={form.partySize}
                            onChange={(e) => {
                              const value = e.target.value;
                              setForm((prev) => ({
                                ...prev,
                                partySize: value,
                                table: "",
                              }));
                            }}
                            placeholder="How many guests?"
                          />
                        </div>
                        <div className="space-y-2.5">
                          <Label htmlFor="location" className="flex items-center gap-2">
                            <MapPinIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                            Area
                          </Label>
                          <Select
                            value={form.location}
                            onValueChange={(value) => {
                              setForm((prev) => ({ ...prev, location: value, table: "" }));
                            }}
                            required
                            disabled={!partySizeNum}
                          >
                            <SelectTrigger id="location" aria-label="Select area" className="min-w-0">
                              <SelectValue placeholder={locationLabel} className="truncate" />
                            </SelectTrigger>
                            <SelectContent>
                              {LOCATIONS.map((location) => (
                                <SelectItem key={location.value} value={location.value}>
                                  {location.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2.5">
                          <Label htmlFor="table" className="flex items-center gap-2">
                            <UtensilsIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                            Table
                          </Label>
                          <Select
                            value={form.table}
                            onValueChange={(value) => handleChange("table", value)}
                            required
                            disabled={eligibleTables.length === 0}
                          >
                            <SelectTrigger id="table" aria-label="Select a table" className="min-w-0">
                              <SelectValue placeholder={tableLabel} className="truncate" />
                            </SelectTrigger>
                            <SelectContent>
                              {eligibleTables.map((table) => (
                                <SelectItem key={table._id} value={table._id}>
                                  T{table.tableNumber} · {table.capacity} guests
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {partySizeNum > 0 && form.location && eligibleTables.length === 0 && (
                            <p className="text-sm text-destructive">
                              No {form.location} table fits {partySizeNum} guests right now
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <SplitText className="text-sm font-mono uppercase tracking-[0.22em] text-primary" delay={0.1}>
                        Date & time
                      </SplitText>
                      <div className="grid gap-5 sm:grid-cols-3">
                        <div className="space-y-2.5">
                          <Label htmlFor="date" className="flex items-center gap-2">
                            <CalendarIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                            Date
                          </Label>
                          <Input
                            id="date"
                            type="date"
                            required
                            value={form.date}
                            onChange={(e) => handleChange("date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="startTime" className="flex items-center gap-2">
                          <ClockIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                          Start time
                        </Label>
                        <Input
                          id="startTime"
                          type="time"
                          required
                          value={form.startTime}
                          onChange={(e) => handleChange("startTime", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <Label htmlFor="endTime" className="flex items-center gap-2">
                          <ClockIcon className="size-4 text-muted-foreground" strokeWidth={1.5} />
                          End time
                        </Label>
                        <Input
                          id="endTime"
                          type="time"
                          required
                          value={form.endTime}
                          onChange={(e) => handleChange("endTime", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      placeholder="Allergies, special occasion, seating preference"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading.mutation || eligibleTables.length === 0}
                    className="h-14 w-full gap-2 rounded-full text-base"
                  >
                    {loading.mutation ? "Booking…" : "Book table"}
                    {!loading.mutation && <ArrowRight className="size-5" strokeWidth={1.5} />}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          </AnimatedSection>

          <AnimatedSection delay={0.15} className="hidden lg:block">
            <div className="sticky top-32 space-y-6 rounded-[2rem] border border-foreground/5 bg-secondary/30 p-8">
              <h3 className="font-display text-2xl font-semibold tracking-tight">Reservation notes</h3>
              <ul className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <li className="flex gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Choose a table that comfortably seats your party</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Arrive within 15 minutes of your selected time</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>Special requests are noted for the host team</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
      </Container>
    </>
  );
}
