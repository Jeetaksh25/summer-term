"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Users, Armchair, LogOut, RefreshCw } from "lucide-react";
import { useFunctionStore } from "@/store/functionStore";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input, Select } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Table, Reservation, WaitlistEntry, WaitlistStatus } from "@/types";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/animated-section";

const CHART_FOREST = "#2D4A3E";
const CHART_MOSS = "#6B8E7B";
const CHART_STEEL = "#6B6B6B";
const CHART_TERRACOTTA = "#B54A3A";
const CHART_AMBER = "#C9A227";

const reservationStatusOrder = ["confirmed", "seated", "completed", "cancelled", "no-show"] as const;
const waitlistStatusOrder = ["waiting", "notified", "seated", "cancelled", "expired"] as const;

const statusColors: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  seated: "bg-primary/15 text-primary dark:bg-primary/30 dark:text-primary-foreground",
  completed: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  "no-show": "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  waiting: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  notified: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  expired: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  available: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  occupied: "bg-primary/15 text-primary dark:bg-primary/30 dark:text-primary-foreground",
  reserved: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  maintenance: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
};

type Tab = "tables" | "reservations" | "waitlist";

export default function AdminDashboardPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    tables,
    reservations,
    waitlist,
    selectedDate,
    loading,
    errors,
    fetchMe,
    logout,
    setSelectedDate,
    fetchTables,
    createTable,
    updateTable,
    deleteTable,
    fetchReservations,
    updateReservation,
    cancelReservation,
    fetchWaitlist,
    seatWaitlistEntry,
    cancelWaitlistEntry,
    clearError,
  } = useFunctionStore();

  const [tab, setTab] = useState<Tab>("tables");
  const [tableForm, setTableForm] = useState<Omit<Table, "_id" | "createdAt" | "updatedAt">>({
    tableNumber: "",
    capactiy: 1,
    location: "indoor",
    status: "available",
    isActive: true,
  });
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!isAuthenticated && !loading.auth) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, loading.auth, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchTables();
    fetchReservations();
    fetchWaitlist();
  }, [isAuthenticated, fetchTables, fetchReservations, fetchWaitlist]);

  const reservationHourData = useMemo(() => {
    const counts = new Map<string, number>();
    reservations.forEach((r) => {
      const hour = r.startTime.slice(0, 2) || "--";
      counts.set(hour, (counts.get(hour) || 0) + 1);
    });
    const sorted = Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    return sorted.map(([hour, count]) => ({ hour, count }));
  }, [reservations]);

  const tableStatusData = useMemo(() => {
    const counts = new Map<string, number>();
    tables.forEach((t) => {
      counts.set(t.status, (counts.get(t.status) || 0) + 1);
    });
    return ["available", "occupied", "reserved", "maintenance"].map((status) => ({
      name: status,
      value: counts.get(status) || 0,
    }));
  }, [tables]);

  const waitlistStatusData = useMemo(() => {
    const counts = new Map<string, number>();
    waitlist.forEach((w) => {
      counts.set(w.status, (counts.get(w.status) || 0) + 1);
    });
    return waitlistStatusOrder.map((status) => ({
      name: status,
      value: counts.get(status) || 0,
    }));
  }, [waitlist]);

  const occupancyRate = useMemo(() => {
    const activeTables = tables.filter((t) => t.isActive);
    if (activeTables.length === 0) return 0;
    const occupiedOrReserved = activeTables.filter(
      (t) => t.status === "occupied" || t.status === "reserved"
    ).length;
    return Math.round((occupiedOrReserved / activeTables.length) * 100);
  }, [tables]);

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createTable(tableForm);
    if (result) {
      toast.success("Table added");
      setTableForm({ tableNumber: "", capactiy: 1, location: "indoor", status: "available", isActive: true });
    } else {
      toast.error(errors.mutation || "Failed to add table");
    }
  };

  const handleUpdateTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTable) return;
    const result = await updateTable(editingTable._id, editingTable);
    if (result) {
      toast.success("Table updated");
      setEditingTable(null);
    } else {
      toast.error(errors.mutation || "Failed to update table");
    }
  };

  const handleDeleteTable = async (id: string) => {
    const ok = await deleteTable(id);
    if (ok) toast.success("Table deleted");
    else toast.error(errors.mutation || "Failed to delete table");
  };

  const handleUpdateReservationStatus = async (id: string, status: string) => {
    const result = await updateReservation(id, { status: status as Reservation["status"] });
    if (result) toast.success("Reservation updated");
    else toast.error(errors.mutation || "Failed to update reservation");
  };

  const handleCancelReservation = async (id: string) => {
    const result = await cancelReservation(id);
    if (result) toast.success("Reservation cancelled");
    else toast.error(errors.mutation || "Failed to cancel reservation");
  };

  const handleSeatWaitlist = async (id: string) => {
    const result = await seatWaitlistEntry(id, { status: "seated" as WaitlistStatus });
    if (result) toast.success("Waitlist entry seated");
    else toast.error(errors.mutation || "Failed to seat entry");
  };

  const handleCancelWaitlist = async (id: string) => {
    const result = await cancelWaitlistEntry(id);
    if (result) toast.success("Waitlist entry cancelled");
    else toast.error(errors.mutation || "Failed to cancel entry");
  };

  if (loading.auth || !isAuthenticated || !user) {
    return (
      <Container className="py-16">
        <p className="text-muted-foreground">Checking authentication…</p>
      </Container>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name}. Manage tables, reservations, and waitlist.`}
      >
        <Button variant="outline" size="sm" onClick={logout} className="gap-2">
          <LogOut className="size-4" strokeWidth={1.5} />
          Sign out
        </Button>
      </PageHeader>

      <Container className="pb-20">
        {errors.mutation && (
          <AnimatedSection className="mb-6 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {errors.mutation}
            <button onClick={() => clearError("mutation")} className="ml-2 underline">Dismiss</button>
          </AnimatedSection>
        )}

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          <StaggerItem>
            <StatCard
              icon={<Armchair className="size-5" strokeWidth={1.5} />}
              label="Total tables"
              value={tables.length}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              icon={<Calendar className="size-5" strokeWidth={1.5} />}
              label="Today's reservations"
              value={reservations.length}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              icon={<Users className="size-5" strokeWidth={1.5} />}
              label="Waitlist"
              value={waitlist.length}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              icon={<RefreshCw className="size-5" strokeWidth={1.5} />}
              label="Occupancy"
              value={`${occupancyRate}%`}
            />
          </StaggerItem>
        </StaggerContainer>

        <AnimatedSection delay={0.2} className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card className="min-h-[320px]">
            <CardHeader>
              <CardTitle>Reservations by hour</CardTitle>
              <CardDescription>{selectedDate}</CardDescription>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reservationHourData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                  <Bar dataKey="count" fill={CHART_FOREST} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="min-h-[320px]">
            <CardHeader>
              <CardTitle>Table status</CardTitle>
              <CardDescription>Live distribution across the floor</CardDescription>
            </CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tableStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                  >
                    {tableStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={[CHART_FOREST, CHART_MOSS, CHART_AMBER, CHART_TERRACOTTA][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.3} className="mt-8">
          <Card className="min-h-[260px]">
            <CardHeader>
              <CardTitle>Waitlist status</CardTitle>
              <CardDescription>Where guests are in the queue</CardDescription>
            </CardHeader>
            <CardContent className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waitlistStatusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                    }}
                    labelStyle={{ color: "var(--foreground)" }}
                    itemStyle={{ color: "var(--foreground)" }}
                  />
                  <Bar dataKey="value" fill={CHART_MOSS} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.4} className="mt-10">
          <Tabs value={tab} onValueChange={() => {}}>
            <TabsList className="mb-6">
              {(["tables", "reservations", "waitlist"] as Tab[]).map((t) => (
                <TabsTrigger
                  key={t}
                  value={t}
                  active={tab === t}
                  onClick={() => setTab(t)}
                  className="capitalize"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {tab === "tables" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add table</CardTitle>
                  <CardDescription>Create a new table for guests to book.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTable} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="space-y-2">
                      <Label htmlFor="tableNumber">Number</Label>
                      <Input
                        id="tableNumber"
                        type="text"
                        placeholder="A1"
                        required
                        value={tableForm.tableNumber}
                        onChange={(e) => setTableForm({ ...tableForm, tableNumber: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min={1}
                        required
                        value={tableForm.capactiy}
                        onChange={(e) => setTableForm({ ...tableForm, capactiy: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select
                        id="location"
                        value={tableForm.location}
                        onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
                      >
                        <option value="indoor">Indoor</option>
                        <option value="outdoor">Outdoor</option>
                        <option value="balcony">Balcony</option>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        id="status"
                        value={tableForm.status}
                        onChange={(e) => setTableForm({ ...tableForm, status: e.target.value as Table["status"] })}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="reserved">Reserved</option>
                        <option value="maintenance">Maintenance</option>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" disabled={loading.mutation} className="w-full">Add table</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {errors.tables && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {errors.tables}
                  <button onClick={() => clearError("tables")} className="ml-2 underline">Dismiss</button>
                </div>
              )}

              <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
                {tables.map((table) => (
                  <StaggerItem key={table._id}>
                    <Card className="h-full">
                      <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                          <CardTitle>Table {table.tableNumber}</CardTitle>
                          <CardDescription className="mt-1 capitalize">{table.location}</CardDescription>
                        </div>
                        <Badge variant={table.status === "available" ? "success" : table.status === "maintenance" ? "warning" : "default"}>
                          {table.status}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        {editingTable?._id === table._id ? (
                          <form onSubmit={handleUpdateTable} className="space-y-3">
                            <Input
                              type="text"
                              value={editingTable.tableNumber}
                              onChange={(e) => setEditingTable({ ...editingTable, tableNumber: e.target.value })}
                            />
                            <Input
                              type="number"
                              min={1}
                              value={editingTable.capactiy}
                              onChange={(e) => setEditingTable({ ...editingTable, capactiy: Number(e.target.value) })}
                            />
                            <div className="flex gap-2">
                              <Button type="submit" size="sm" disabled={loading.mutation}>Save</Button>
                              <Button type="button" size="sm" variant="outline" onClick={() => setEditingTable(null)}>Cancel</Button>
                            </div>
                          </form>
                        ) : (
                          <>
                            <div className="flex items-baseline gap-2">
                              <span className="font-display text-3xl font-semibold">{table.capactiy}</span>
                              <span className="text-sm text-muted-foreground">guests</span>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingTable(table)}>Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteTable(table._id)}>Delete</Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}

          {tab === "reservations" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    fetchReservations(e.target.value);
                  }}
                  className="w-auto"
                />
                <Button variant="outline" onClick={() => fetchReservations()} disabled={loading.reservations} className="gap-2">
                  <RefreshCw className={cn("size-4", loading.reservations && "animate-spin")} strokeWidth={1.5} />
                  Refresh
                </Button>
              </div>

              {errors.reservations && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {errors.reservations}
                  <button onClick={() => clearError("reservations")} className="ml-2 underline">Dismiss</button>
                </div>
              )}

              <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
                {reservations.map((r) => (
                  <StaggerItem key={r._id}>
                    <ReservationCard
                      reservation={r}
                      onStatusChange={handleUpdateReservationStatus}
                      onCancel={handleCancelReservation}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {reservations.length === 0 && !loading.reservations && (
                <AnimatedSection className="rounded-2xl border bg-card p-12 text-center">
                  <p className="text-muted-foreground">No reservations for this date.</p>
                </AnimatedSection>
              )}
            </div>
          )}

          {tab === "waitlist" && (
            <div className="space-y-4">
              <Button variant="outline" onClick={() => fetchWaitlist()} disabled={loading.waitlist} className="gap-2">
                <RefreshCw className={cn("size-4", loading.waitlist && "animate-spin")} strokeWidth={1.5} />
                Refresh
              </Button>

              {errors.waitlist && (
                <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                  {errors.waitlist}
                  <button onClick={() => clearError("waitlist")} className="ml-2 underline">Dismiss</button>
                </div>
              )}

              <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.05}>
                {waitlist.map((entry) => (
                  <StaggerItem key={entry._id}>
                    <WaitlistCard entry={entry} onSeat={handleSeatWaitlist} onCancel={handleCancelWaitlist} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {waitlist.length === 0 && !loading.waitlist && (
                <AnimatedSection className="rounded-2xl border bg-card p-12 text-center">
                  <p className="text-muted-foreground">No waitlist entries.</p>
                </AnimatedSection>
              )}
            </div>
          )}
        </AnimatedSection>
      </Container>
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="h-full">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          {icon}
        </div>
        <div>
          <p className="text-xs font-mono uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ReservationCard({
  reservation,
  onStatusChange,
  onCancel,
}: {
  reservation: Reservation;
  onStatusChange: (id: string, status: string) => void;
  onCancel: (id: string) => void;
}) {
  const table = typeof reservation.table === "string" ? null : reservation.table;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{reservation.customerName}</CardTitle>
          <CardDescription className="mt-1">{reservation.contact}</CardDescription>
        </div>
        <Badge variant={reservationStatusOrder.includes(reservation.status as typeof reservationStatusOrder[number]) ? (reservation.status === "confirmed" ? "success" : reservation.status === "cancelled" ? "destructive" : "default") : "outline"}>
          {reservation.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{reservation.date}</span> · {reservation.startTime}–{reservation.endTime} · Party of {reservation.partySize}
        </div>
        {table && <p className="text-sm text-muted-foreground">Table {table.tableNumber}</p>}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Select
            value={reservation.status}
            onChange={(e) => onStatusChange(reservation._id, e.target.value)}
            className="w-auto min-w-[140px]"
          >
            <option value="confirmed">Confirmed</option>
            <option value="seated">Seated</option>
            <option value="completed">Completed</option>
            <option value="no-show">No-show</option>
          </Select>
          <Button size="sm" variant="destructive" onClick={() => onCancel(reservation._id)}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WaitlistCard({
  entry,
  onSeat,
  onCancel,
}: {
  entry: WaitlistEntry;
  onSeat: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const table = typeof entry.table === "string" || !entry.table ? null : entry.table;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-base">{entry.customerName}</CardTitle>
          <CardDescription className="mt-1">{entry.contact}</CardDescription>
        </div>
        <Badge variant={entry.status === "waiting" ? "warning" : entry.status === "seated" ? "success" : "default"}>
          {entry.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{entry.preferredDate}</span> at {entry.requestedTime} · Party of {entry.partySize}
        </div>
        {table && <p className="text-sm text-muted-foreground">Table {table.tableNumber}</p>}
        <div className="flex gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={() => onSeat(entry._id)}>Seat</Button>
          <Button size="sm" variant="destructive" onClick={() => onCancel(entry._id)}>Cancel</Button>
        </div>
      </CardContent>
    </Card>
  );
}
