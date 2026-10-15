import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { combos, dayInfo, PRICE } from "./data";
import { isFirebaseConfigured, toCineHubUser, watchGoogleAuth, signOutGoogle } from "./services/firebaseAuth";

export type User = { uid?: string; name: string; email: string; photoURL?: string; provider?: "google" | "email" } | null;
export type SeatZone = "normal" | "vip" | "sweetbox";
export type Booking = {
  movieId: number | string | null;
  movieTitle?: string;
  movieAge?: string;
  movieDuration?: string | number;
  moviePoster?: string;
  cinema: string;
  cinemaCode?: string;
  cinemaAddress?: string;
  cinemaPhone?: string;
  format: string;
  caption?: string;
  version?: string;
  screenName?: string;
  sessionId?: string;
  time: string;
  dateLabel: string;
  seats: string[];
  seatTypes: Record<string, SeatZone>;
  combos: Record<string, number>;
  expiresAt: number | null;
};
export type Order = {
  code: string;
  movieId: number | string;
  movieTitle?: string;
  moviePoster?: string;
  cinema: string;
  cinemaCode?: string;
  cinemaAddress?: string;
  cinemaPhone?: string;
  screenName?: string;
  format: string;
  caption?: string;
  version?: string;
  time: string;
  dateLabel: string;
  seats: string[];
  items: { name: string; qty: number }[];
  total: number;
  method: string;
  status: "upcoming" | "past";
  purchasedAt?: number;
};

const empty: Booking = { movieId: null, cinema: "", format: "", time: "", dateLabel: "", seats: [], seatTypes: {}, combos: {}, expiresAt: null };
const accountStorageKey = (user: NonNullable<User> | null) => user
  ? `cinehub:account:${encodeURIComponent(user.uid || user.email.toLowerCase())}`
  : "cinehub:guest";
const readStored = <T,>(key: string, fallback: T): T => {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    localStorage.removeItem(key);
    return fallback;
  }
};

const seedOrders: Order[] = [
  { code: "CH-0930-7K2MQ", movieId: 2, cinema: "CGV Vincom Landmark 81", format: "2D", time: "19:45", dateLabel: dayInfo(2).label, seats: ["E7", "E8"], items: [{ name: "Combo Đôi", qty: 1 }], total: 309000, method: "VNPay", status: "upcoming" },
  { code: "CH-0924-3PX8D", movieId: 1, cinema: "Lotte Cinema Nowzone", format: "3D", time: "21:00", dateLabel: dayInfo(-5).label, seats: ["H10"], items: [], total: 120000, method: "ZaloPay", status: "past" },
  { code: "CH-0911-9LQ4V", movieId: 4, cinema: "CGV Aeon Tân Phú", format: "2D", time: "16:20", dateLabel: dayInfo(-18).label, seats: ["C5", "C6"], items: [{ name: "Combo Solo", qty: 1 }], total: 259000, method: "VNPay", status: "past" },
];

export const seatTypeFor = (seat: string, zone?: SeatZone) => zone ?? (seat === "E7" || seat === "E8" ? "sweetbox" : seat.charCodeAt(0) - 65 >= 5 ? "vip" : "normal");
export const seatPrice = (seat: string, zone?: SeatZone) => {
  const type = seatTypeFor(seat, zone);
  return type === "sweetbox" ? PRICE.sweetbox : type === "vip" ? PRICE.vip : PRICE.normal;
};
export const ticketsTotal = (b: Booking) => b.seats.reduce((s, x) => s + seatPrice(x, b.seatTypes[x]), 0);
export const combosTotal = (b: Booking) => combos.reduce((s, c) => s + (b.combos[c.id] || 0) * c.price, 0);

type Ctx = {
  user: User; authLoading: boolean; login: (u: NonNullable<User>) => void; logout: () => Promise<void>;
  booking: Booking; patch: (p: Partial<Booking>) => void; startBooking: (p: Partial<Booking>) => void; reset: () => void;
  orders: Order[]; lastOrder: Order | null; place: (method: string) => Order;
  notified: (number | string)[]; toggleNotify: (id: number | string) => void;
  collections: (number | string)[]; toggleCollection: (id: number | string) => void;
  recentMovies: (number | string)[]; watchProgress: Record<string | number, number>; trackMovie: (id: number | string, progress?: number) => void;
};
const C = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(C);

export function Provider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured);
  const [booking, setBooking] = useState<Booking>(empty);
  const [orders, setOrders] = useState<Order[]>(() => readStored("cinehub:guest:orders", seedOrders));
  const [lastOrder, setLast] = useState<Order | null>(null);
  const [notified, setNotified] = useState<(number | string)[]>(() => readStored("cinehub:guest:notified", []));
  const [collections, setCollections] = useState<(number | string)[]>(() => readStored("cinehub:guest:collection", readStored("cinehub:collection", [])));
  const [recentMovies, setRecentMovies] = useState<(number | string)[]>(() => readStored("cinehub:guest:recent", []));
  const [watchProgress, setWatchProgress] = useState<Record<string | number, number>>(() => readStored("cinehub:guest:progress", {}));

  const activateUser = (nextUser: User) => {
    const key = accountStorageKey(nextUser);
    setUser(nextUser);
    setOrders(readStored(`${key}:orders`, nextUser ? [] : seedOrders));
    setLast(null);
    setNotified(readStored(`${key}:notified`, []));
    setCollections(readStored(`${key}:collection`, nextUser ? [] : readStored("cinehub:collection", [])));
    setRecentMovies(readStored(`${key}:recent`, []));
    setWatchProgress(readStored(`${key}:progress`, {}));
  };

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    return watchGoogleAuth((firebaseUser) => {
      activateUser(firebaseUser ? toCineHubUser(firebaseUser) : null);
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    const key = accountStorageKey(user);
    localStorage.setItem(`${key}:orders`, JSON.stringify(orders));
    localStorage.setItem(`${key}:notified`, JSON.stringify(notified));
    localStorage.setItem(`${key}:collection`, JSON.stringify(collections));
    localStorage.setItem(`${key}:recent`, JSON.stringify(recentMovies));
    localStorage.setItem(`${key}:progress`, JSON.stringify(watchProgress));
  }, [user, orders, notified, collections, recentMovies, watchProgress]);

  const toggleCollection = (id: number | string) => setCollections((items) => {
    const next = items.includes(id) ? items.filter((item) => item !== id) : [id, ...items];
    return next;
  });
  const trackMovie = (id: number | string, progress = 8) => {
    setRecentMovies((items) => [id, ...items.filter((item) => item !== id)].slice(0, 10));
    setWatchProgress((items) => ({ ...items, [id]: Math.max(items[id] || 0, progress) }));
  };

  const value: Ctx = {
    user, authLoading, login: activateUser,
    logout: async () => { await signOutGoogle(); activateUser(null); },
    booking,
    patch: (p) => setBooking((b) => ({ ...b, ...p })),
    startBooking: (p) => setBooking({ ...empty, ...p, expiresAt: Date.now() + 15 * 60 * 1000 }),
    reset: () => setBooking(empty),
    orders, lastOrder,
    place: (method) => {
      const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
      const d = new Date();
      const o: Order = {
        code: `CH-${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${rnd}`,
        movieId: booking.movieId!,
        movieTitle: booking.movieTitle,
        moviePoster: booking.moviePoster,
        cinema: booking.cinema,
        cinemaCode: booking.cinemaCode,
        cinemaAddress: booking.cinemaAddress,
        cinemaPhone: booking.cinemaPhone,
        screenName: booking.screenName,
        format: booking.format,
        caption: booking.caption,
        version: booking.version,
        time: booking.time,
        dateLabel: booking.dateLabel,
        seats: booking.seats,
        items: combos.filter((c) => booking.combos[c.id]).map((c) => ({ name: c.name, qty: booking.combos[c.id] })),
        total: ticketsTotal(booking) + combosTotal(booking), method, status: "upcoming", purchasedAt: Date.now(),
      };
      setOrders((x) => [o, ...x]); setLast(o); setBooking(empty);
      return o;
    },
    notified, toggleNotify: (id) => setNotified((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id])),
    collections, toggleCollection, recentMovies, watchProgress, trackMovie,
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
