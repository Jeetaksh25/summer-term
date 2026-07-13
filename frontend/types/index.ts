export interface PopulatedTable {
  _id: string;
  tableNumber: string;
  capacity: number;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "owner" | "staff";
}

export interface Table {
  _id: string;
  tableNumber: string;
  capactiy: number;
  location: "indoor" | "outdoor" | "balcony" | string;
  status: "available" | "occupied" | "reserved" | "maintenance";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ReservationStatus =
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no-show";

export interface Reservation {
  _id: string;
  customerName: string;
  contact: string;
  partySize: number;
  table: string | PopulatedTable;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export type WaitlistStatus =
  | "waiting"
  | "notified"
  | "seated"
  | "cancelled"
  | "expired";

export interface WaitlistEntry {
  _id: string;
  customerName: string;
  contact: string;
  partySize: number;
  preferredDate: string;
  requestedTime: string;
  status: WaitlistStatus;
  priority: number;
  table?: string | PopulatedTable;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiState {
  loading: boolean;
  error: string | null;
}