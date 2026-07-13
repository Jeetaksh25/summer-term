import { create } from "zustand";
import { api } from "@/lib/axios";
import { getToken, setToken, removeToken, setUser, removeUser } from "@/lib/auth";
import {
  Table,
  Reservation,
  WaitlistEntry,
  WaitlistStatus,
  User,
} from "@/types";
import { AxiosError } from "axios";

interface LoadingMap {
  tables: boolean;
  reservations: boolean;
  waitlist: boolean;
  mutation: boolean;
  auth: boolean;
}

interface ErrorMap {
  tables: string | null;
  reservations: string | null;
  waitlist: string | null;
  mutation: string | null;
  auth: string | null;
}

interface FunctionStore {
  tables: Table[];
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
  selectedDate: string;
  loading: LoadingMap;
  errors: ErrorMap;
  user: User | null;
  isAuthenticated: boolean;

  setSelectedDate: (date: string) => void;
  clearError: (key: keyof ErrorMap) => void;

  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  fetchMe: () => Promise<void>;

  fetchTables: () => Promise<void>;
  createTable: (
    payload: Omit<Table, "_id" | "createdAt" | "updatedAt">
  ) => Promise<Table | null>;
  updateTable: (
    id: string,
    payload: Partial<Omit<Table, "_id" | "createdAt" | "updatedAt">>
  ) => Promise<Table | null>;
  deleteTable: (id: string) => Promise<boolean>;

  fetchReservations: (date?: string) => Promise<void>;
  createReservation: (
    payload: Omit<Reservation, "_id" | "createdAt" | "updatedAt" | "status">
  ) => Promise<Reservation | null>;
  updateReservation: (
    id: string,
    payload: Partial<Omit<Reservation, "_id" | "createdAt" | "updatedAt">>
  ) => Promise<Reservation | null>;
  cancelReservation: (id: string) => Promise<Reservation | null>;

  fetchWaitlist: () => Promise<void>;
  addToWaitlist: (
    payload: Omit<WaitlistEntry, "_id" | "createdAt" | "updatedAt" | "status" | "priority">
  ) => Promise<WaitlistEntry | null>;
  seatWaitlistEntry: (
    id: string,
    payload?: { table?: string; status?: WaitlistStatus }
  ) => Promise<WaitlistEntry | null>;
  cancelWaitlistEntry: (id: string) => Promise<WaitlistEntry | null>;
}

const initialLoading: LoadingMap = {
  tables: false,
  reservations: false,
  waitlist: false,
  mutation: false,
  auth: true,
};

const initialErrors: ErrorMap = {
  tables: null,
  reservations: null,
  waitlist: null,
  mutation: null,
  auth: null,
};

const errorMessage = (err: unknown): string => {
  if (err instanceof AxiosError && err.response?.data?.message) {
    return err.response.data.message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Something went wrong";
};

export const useFunctionStore = create<FunctionStore>((set, get) => ({
  tables: [],
  reservations: [],
  waitlist: [],
  selectedDate: new Date().toISOString().split("T")[0],
  loading: initialLoading,
  errors: initialErrors,
  user: null,
  isAuthenticated: false,

  setSelectedDate: (date) => set({ selectedDate: date }),
  clearError: (key) =>
    set((state) => ({ errors: { ...state.errors, [key]: null } })),

  login: async (email, password) => {
    set({ loading: { ...get().loading, auth: true }, errors: { ...get().errors, auth: null } });
    try {
      const { data } = await api.post<{ token: string; user: User }>("/api/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      set({ user: data.user, isAuthenticated: true });
      return data.user;
    } catch (err) {
      const message = errorMessage(err);
      set({ errors: { ...get().errors, auth: message } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, auth: false } }));
    }
  },

  logout: () => {
    removeToken();
    removeUser();
    set({ user: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    if (!getToken()) return;
    set({ loading: { ...get().loading, auth: true } });
    try {
      const { data } = await api.get<User>("/api/auth/me");
      setUser(data);
      set({ user: data, isAuthenticated: true });
    } catch {
      removeToken();
      removeUser();
      set({ user: null, isAuthenticated: false });
    } finally {
      set((state) => ({ loading: { ...state.loading, auth: false } }));
    }
  },

  fetchTables: async () => {
    set({
      loading: { ...get().loading, tables: true },
      errors: { ...get().errors, tables: null },
    });
    try {
      const { data } = await api.get<Table[]>("/api/tables");
      set({ tables: data });
    } catch (err) {
      set({ errors: { ...get().errors, tables: errorMessage(err) } });
    } finally {
      set((state) => ({ loading: { ...state.loading, tables: false } }));
    }
  },

  createTable: async (payload) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.post<Table>("/api/tables", payload);
      set((state) => ({ tables: [...state.tables, data] }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  updateTable: async (id, payload) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.put<Table>(`/api/tables/${id}`, payload);
      set((state) => ({
        tables: state.tables.map((t) => (t._id === id ? data : t)),
      }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  deleteTable: async (id) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      await api.delete(`/api/tables/${id}`);
      set((state) => ({
        tables: state.tables.filter((t) => t._id !== id),
      }));
      return true;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return false;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  fetchReservations: async (date) => {
    const selectedDate = date || get().selectedDate;
    set({
      loading: { ...get().loading, reservations: true },
      errors: { ...get().errors, reservations: null },
    });
    try {
      const { data } = await api.get<Reservation[]>("/api/reservations", {
        params: { date: selectedDate },
      });
      set({ reservations: data });
    } catch (err) {
      set({ errors: { ...get().errors, reservations: errorMessage(err) } });
    } finally {
      set((state) => ({
        loading: { ...state.loading, reservations: false },
      }));
    }
  },

  createReservation: async (payload) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.post<Reservation>("/api/reservations", payload);
      set((state) => ({ reservations: [...state.reservations, data] }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  updateReservation: async (id, payload) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.put<Reservation>(
        `/api/reservations/${id}`,
        payload
      );
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id ? data : r
        ),
      }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  cancelReservation: async (id) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.patch<Reservation>(
        `/api/reservations/${id}/cancel`
      );
      set((state) => ({
        reservations: state.reservations.map((r) =>
          r._id === id ? data : r
        ),
      }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  fetchWaitlist: async () => {
    set({
      loading: { ...get().loading, waitlist: true },
      errors: { ...get().errors, waitlist: null },
    });
    try {
      const { data } = await api.get<WaitlistEntry[]>("/api/waitlist");
      set({ waitlist: data });
    } catch (err) {
      set({ errors: { ...get().errors, waitlist: errorMessage(err) } });
    } finally {
      set((state) => ({ loading: { ...state.loading, waitlist: false } }));
    }
  },

  addToWaitlist: async (payload) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.post<WaitlistEntry>("/api/waitlist", payload);
      set((state) => ({ waitlist: [...state.waitlist, data] }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  seatWaitlistEntry: async (id, payload) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.patch<WaitlistEntry>(
        `/api/waitlist/${id}/seat`,
        payload || {}
      );
      set((state) => ({
        waitlist: state.waitlist.map((entry) =>
          entry._id === id ? data : entry
        ),
      }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },

  cancelWaitlistEntry: async (id) => {
    set({
      loading: { ...get().loading, mutation: true },
      errors: { ...get().errors, mutation: null },
    });
    try {
      const { data } = await api.patch<WaitlistEntry>(
        `/api/waitlist/${id}/cancel`
      );
      set((state) => ({
        waitlist: state.waitlist.map((entry) =>
          entry._id === id ? data : entry
        ),
      }));
      return data;
    } catch (err) {
      set({ errors: { ...get().errors, mutation: errorMessage(err) } });
      return null;
    } finally {
      set((state) => ({ loading: { ...state.loading, mutation: false } }));
    }
  },
}));