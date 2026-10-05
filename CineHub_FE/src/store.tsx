import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { combos, dayInfo, PRICE } from "./data";

export type User = { name: string; email: string } | null;
export type Booking = {
  movieId: number | null; cinema: string; format: string; time: string; dateLabel: string;
  seats: string[]; combos: Record<string, number>; expiresAt: number | null;
};
export type Order = {
  code: string; movieId: number; cinema: string; format: string; time: string; dateLabel: string;
  seats: string[]; items: { name: string; qty: number }[]; total: number; method: string; status: "upcoming" | "past";
};

const empty: Booking = { movieId: null, cinema: "", format: "", time: "", dateLabel: "", seats: [], combos: {}, expiresAt: null };

const seedOrders: Order[] = [
  { code: "CH-0930-7K2MQ", movieId: 2, cinema: "CGV Vincom Landmark 81", format: "2D", time: "19:45", dateLabel: dayInfo(2).label, seats: ["E7", "E8"], items: [{ name: "Combo Đôi", qty: 1 }], total: 309000, method: "VNPay", status: "upcoming" },
  { code: "CH-0924-3PX8D", movieId: 1, cinema: "Lotte Cinema Nowzone", format: "3D", time: "21:00", dateLabel: dayInfo(-5).label, seats: ["H10"], items: [], total: 120000, method: "ZaloPay", status: "past" },
  { code: "CH-0911-9LQ4V", movieId: 4, cinema: "CGV Aeon Tân Phú", format: "2D", time: "16:20", dateLabel: dayInfo(-18).label, seats: ["C5", "C6"], items: [{ name: "Combo Solo", qty: 1 }], total: 259000, method: "VNPay", status: "past" },
];

export const seatPrice = (seat: string) => (seat.charCodeAt(0) - 65 >= 5 ? PRICE.vip : PRICE.normal);
export const ticketsTotal = (b: Booking) => b.seats.reduce((s, x) => s + seatPrice(x), 0);
export const combosTotal = (b: Booking) => combos.reduce((s, c) => s + (b.combos[c.id] || 0) * c.price, 0);

type Ctx = {
  user: User; login: (u: NonNullable<User>) => void; logout: () => void;
  booking: Booking; patch: (p: Partial<Booking>) => void; startBooking: (p: Partial<Booking>) => void; reset: () => void;
  orders: Order[]; lastOrder: Order | null; place: (method: string) => Order;
  notified: number[]; toggleNotify: (id: number) => void;
};
const C = createContext<Ctx>(null as unknown as Ctx);
export const useStore = () => useContext(C);

export function Provider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [booking, setBooking] = useState<Booking>(empty);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [lastOrder, setLast] = useState<Order | null>(null);
  const [notified, setNotified] = useState<number[]>([]);

  const value: Ctx = {
    user, login: setUser, logout: () => setUser(null),
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
        movieId: booking.movieId!, cinema: booking.cinema, format: booking.format, time: booking.time, dateLabel: booking.dateLabel,
        seats: booking.seats,
        items: combos.filter((c) => booking.combos[c.id]).map((c) => ({ name: c.name, qty: booking.combos[c.id] })),
        total: ticketsTotal(booking) + combosTotal(booking), method, status: "upcoming",
      };
      setOrders((x) => [o, ...x]); setLast(o); setBooking(empty);
      return o;
    },
    notified, toggleNotify: (id) => setNotified((n) => (n.includes(id) ? n.filter((x) => x !== id) : [...n, id])),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}
