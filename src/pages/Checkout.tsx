import { useState } from "react";
import { combos, fmt, movies } from "../data";
import { go } from "../router";
import { combosTotal, seatPrice, seatTypeFor, ticketsTotal, useStore } from "../store";
import { btnPrimary, HoldTimer, Icon, Steps } from "../components/ui";

const methods = [
  { id: "VNPay", desc: "Quét QR hoặc thanh toán bằng thẻ ATM nội địa", badge: "bg-[#0b4da2]", mark: "VN" },
  { id: "ZaloPay", desc: "Thanh toán nhanh bằng ví ZaloPay", badge: "bg-[#1473e6]", mark: "Z" },
];

export default function Checkout() {
  const { booking, place } = useStore();
  const [method, setMethod] = useState("VNPay");
  const [busy, setBusy] = useState(false);
  const m = movies.find((v) => String(v.id) === String(booking.movieId)) || {
    id: booking.movieId || 1,
    title: booking.movieTitle || "Phim",
    poster: booking.moviePoster || "",
    age: booking.movieAge || "T13",
  };
  const tickets = ticketsTotal(booking), food = combosTotal(booking);
  const items = combos.filter((c) => booking.combos[c.id]);

  const pay = () => { setBusy(true); setTimeout(() => { place(method); go("/result/success"); }, 1200); };
  const row = "flex justify-between gap-6 py-3 text-sm";

  return (
    <main>
      <HoldTimer />
      <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-9">
        <button onClick={() => go("/booking/concessions")} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/45 hover:text-white"><Icon name="back" size={17} /> Quay lại bắp nước</button>
        <Steps current={3} />
        <h1 className="text-3xl font-extrabold tracking-tight">Thanh toán</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <section className="glass-panel rounded-3xl p-6">
            <h2 className="text-lg font-extrabold">Thông tin đơn hàng</h2>
            <dl className="mt-4 divide-y divide-white/8">
              <div className={row}><dt className="text-white/40">Phim</dt><dd className="text-right font-bold">{m.title} ({m.age})</dd></div>
              <div className={row}><dt className="text-white/40">Suất chiếu</dt><dd className="text-right font-bold">{booking.time} · {booking.dateLabel} · <span className="text-[#f5b50a]">{booking.format}</span></dd></div>
              <div className={row}><dt className="text-white/40">Phòng chiếu</dt><dd className="text-right font-bold text-white">{booking.screenName || "Sảnh tiêu chuẩn"}</dd></div>
              <div className={row}><dt className="text-white/40">Rạp</dt><dd className="text-right font-bold">{booking.cinema} {booking.cinemaCode ? `(${booking.cinemaCode})` : ""}</dd></div>
              {booking.cinemaAddress && <div className={row}><dt className="text-white/40">Địa chỉ rạp</dt><dd className="text-right text-xs text-white/70 max-w-[280px]">{booking.cinemaAddress}</dd></div>}
              <div className={row}><dt className="text-white/40">Mã ghế</dt><dd className="text-right font-bold text-[#f5b50a]">{booking.seats.map((s) => `${s} (${seatTypeFor(s, booking.seatTypes[s]) === "sweetbox" ? "Sweetbox" : seatTypeFor(s, booking.seatTypes[s]) === "vip" ? "VIP" : "Thường"} · ${fmt(seatPrice(s, booking.seatTypes[s]))})`).join(", ")}</dd></div>
              <div className={row}><dt className="text-white/40">Bắp nước</dt><dd className="text-right font-bold">{items.length ? items.map((c) => <div key={c.id}>{booking.combos[c.id]} × {c.name}</div>) : <span className="font-normal text-white/35">Không có</span>}</dd></div>
            </dl>
          </section>

          <aside className="glass-panel h-fit rounded-3xl p-6 lg:sticky lg:top-36">
            <fieldset>
              <legend className="text-lg font-extrabold">Phương thức thanh toán</legend>
              <div className="mt-4 space-y-3">
                {methods.map((x) => (
                  <label key={x.id} className={`glass-card flex cursor-pointer items-center gap-4 rounded-2xl p-4 ${method === x.id ? "glass-selected" : ""}`}>
                    <input type="radio" name="method" value={x.id} checked={method === x.id} onChange={() => setMethod(x.id)} className="h-4 w-4 accent-[#e50914]" />
                    <span className={`grid h-9 w-11 place-items-center rounded-md text-xs font-black ${x.badge}`}>{x.mark}</span>
                    <span><b className="block text-sm">{x.id}</b><small className="mt-0.5 block text-[11px] leading-4 text-white/35">{x.desc}</small></span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-6 space-y-2 border-t border-white/8 pt-5 text-sm text-white/50">
              <div className="flex justify-between"><span>Vé ({booking.seats.length})</span><span className="tabular-nums">{fmt(tickets)}</span></div>
              <div className="flex justify-between"><span>Bắp nước</span><span className="tabular-nums">{fmt(food)}</span></div>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-white/8 pt-4"><b>Tổng cộng</b><strong className="text-2xl tabular-nums">{fmt(tickets + food)}</strong></div>
            <button onClick={pay} disabled={busy} className={`${btnPrimary} mt-6 w-full`}>{busy ? "Đang xử lý..." : "Thanh toán ngay"}</button>
            <button onClick={() => go("/result/failed?reason=cancel")} disabled={busy} className="mt-3 w-full py-2 text-xs font-bold text-white/35 hover:text-white">Hủy thanh toán</button>
            <button onClick={() => go("/result/failed?reason=error")} disabled={busy} className="w-full py-1 text-[11px] text-white/20 hover:text-white/50">(Demo) Giả lập thanh toán lỗi</button>
          </aside>
        </div>
      </div>
    </main>
  );
}
