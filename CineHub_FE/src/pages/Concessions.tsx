import { combos, fmt, movies } from "../data";
import { go } from "../router";
import { combosTotal, ticketsTotal, useStore } from "../store";
import { btnPrimary, HoldTimer, Icon, Steps } from "../components/ui";

export default function Concessions() {
  const { booking, patch } = useStore();
  const m = movies.find((v) => v.id === booking.movieId)!;
  const qty = (id: string) => booking.combos[id] || 0;
  const set = (id: string, n: number) => patch({ combos: { ...booking.combos, [id]: Math.max(0, Math.min(10, n)) } });
  const tickets = ticketsTotal(booking), food = combosTotal(booking);

  return (
    <main>
      <HoldTimer />
      <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-9">
        <button onClick={() => go("/booking/seats")} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/45 hover:text-white"><Icon name="back" size={17} /> Quay lại chọn ghế</button>
        <Steps current={2} />
        <h1 className="text-3xl font-extrabold tracking-tight">Bắp nước</h1>
        <p className="mt-2 text-sm text-white/45">Đặt trước để nhận ngay tại quầy, không phải xếp hàng. Bạn có thể bỏ qua bước này.</p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {combos.map((c) => (
            <li key={c.id} className={`flex items-center gap-4 rounded-xl border p-4 transition ${qty(c.id) ? "border-[#e50914]/60 bg-[#e50914]/5" : "border-white/8 bg-[#13151a]"}`}>
              <span className="grid h-24 w-24 shrink-0 place-items-center rounded-lg bg-[radial-gradient(circle_at_30%_20%,#3a2a12,#1a1610)] text-5xl" aria-hidden="true">{c.emoji}</span>
              <div className="min-w-0 flex-1">
                <h2 className="font-extrabold">{c.name}</h2>
                <p className="mt-1 text-xs leading-5 text-white/40">{c.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <b className="tabular-nums text-[#f5b50a]">{fmt(c.price)}</b>
                  <div className="flex items-center gap-1 rounded-full border border-white/12 p-1">
                    <button onClick={() => set(c.id, qty(c.id) - 1)} disabled={!qty(c.id)} aria-label={`Giảm ${c.name}`} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10 disabled:opacity-30"><Icon name="minus" size={16} /></button>
                    <span className="w-6 text-center text-sm font-bold tabular-nums" aria-live="polite">{qty(c.id)}</span>
                    <button onClick={() => set(c.id, qty(c.id) + 1)} aria-label={`Tăng ${c.name}`} className="grid h-8 w-8 place-items-center rounded-full bg-[#e50914] hover:bg-[#ff101c]"><Icon name="plus" size={16} /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-white/30">{m.title} · {booking.cinema} · {booking.time}</p>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-white/10 bg-[#0e1014]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 md:px-9">
          <div className="flex-1 text-xs text-white/45"><div>Vé ({booking.seats.length}): <b className="text-white">{fmt(tickets)}</b></div><div className="mt-1">Bắp nước: <b className="text-white">{fmt(food)}</b></div></div>
          <div className="text-right"><small className="text-xs text-white/40">Tổng tiền</small><b className="block text-xl tabular-nums">{fmt(tickets + food)}</b></div>
          <button onClick={() => go("/booking/checkout")} className={btnPrimary}>{food ? "Tiếp tục" : "Bỏ qua và tiếp tục"} <Icon name="arrow" size={17} /></button>
        </div>
      </div>
    </main>
  );
}
