import { go } from "../router";
import { fmt, hash, movies, PRICE } from "../data";
import { ticketsTotal, useStore } from "../store";
import { btnPrimary, HoldTimer, Icon, Steps } from "../components/ui";

const ROWS = "ABCDEFGHIJ".split("");
const COLS = 14, W = 28, H = 26, P = 34, AISLE = 34, X0 = 30;
const MAX = 8;
const x = (c: number) => X0 + c * P + (c >= COLS / 2 ? AISLE : 0);
const y = (r: number) => 70 + r * 34 + (r >= 5 ? 18 : 0);

export default function Seats() {
  const { booking, patch, reset } = useStore();
  const m = movies.find((v) => v.id === booking.movieId)!;
  const key = `${booking.movieId}${booking.cinema}${booking.dateLabel}${booking.time}`;
  const isSold = (id: string, r: number, c: number) => (hash(key + id) + r * 13 + c * 7) % 100 < 22;
  const sel = booking.seats;
  const toggle = (id: string) => patch({ seats: sel.includes(id) ? sel.filter((s) => s !== id) : sel.length < MAX ? [...sel, id] : sel });
  const total = ticketsTotal(booking);

  return (
    <main>
      <HoldTimer />
      <div className="mx-auto max-w-[1100px] px-5 py-8 md:px-9">
        <button onClick={() => { reset(); go("/showtimes"); }} className="mb-6 flex items-center gap-2 text-sm font-bold text-white/45 hover:text-white"><Icon name="back" size={17} /> Đổi suất chiếu</button>
        <Steps current={1} />
        <h1 className="text-3xl font-extrabold tracking-tight">Chọn ghế</h1>
        <p className="mt-2 text-sm text-white/45">{m.title} · {booking.cinema} · {booking.format} · {booking.time}, {booking.dateLabel}</p>

        <section className="mt-8 rounded-2xl border border-white/8 bg-[#111319] p-4 sm:p-8">
          <div className="overflow-x-auto">
            <svg viewBox="0 0 600 470" className="mx-auto block min-w-[520px] max-w-[720px]" role="group" aria-label="Sơ đồ ghế">
              <defs><linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient></defs>
              <path d="M70 34 Q300 -2 530 34 L520 52 Q300 20 80 52Z" fill="url(#scr)" />
              <text x="300" y="52" textAnchor="middle" fontSize="10" letterSpacing="4" fill="#ffffff66">MÀN HÌNH</text>
              {ROWS.map((L, r) => (
                <g key={L}>
                  <text x="8" y={y(r) + 18} fontSize="11" fill="#ffffff55">{L}</text>
                  {Array.from({ length: COLS }, (_, c) => {
                    const id = `${L}${c + 1}`, vip = r >= 5, sold = isSold(id, r, c), on = sel.includes(id);
                    const fill = sold ? "#24262d" : on ? "#e50914" : vip ? "#4a3d18" : "#696d78";
                    const stroke = sold ? "#2a2c33" : on ? "#ff6a72" : vip ? "#f5b50a" : "#8a8e99";
                    return (
                      <g key={id} role="button" tabIndex={sold ? -1 : 0} aria-label={`Ghế ${id} ${vip ? "VIP" : "thường"} ${sold ? "đã bán" : on ? "đang chọn" : "trống"}`} aria-pressed={on}
                        style={{ cursor: sold ? "not-allowed" : "pointer" }} opacity={sold ? 0.45 : 1}
                        onClick={() => !sold && toggle(id)} onKeyDown={(e) => { if (!sold && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(id); } }}>
                        <rect x={x(c)} y={y(r)} width={W} height={H} rx="7" fill={fill} stroke={stroke} strokeWidth="1.5" />
                        {on && <text x={x(c) + W / 2} y={y(r) + 17} textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">{c + 1}</text>}
                      </g>
                    );
                  })}
                </g>
              ))}
              <text x="300" y="463" textAnchor="middle" fontSize="10" fill="#ffffff40">Hàng F–J là khu VIP</text>
            </svg>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-white/8 pt-5 text-xs text-white/55">
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#8a8e99] bg-[#696d78]" />Thường {fmt(PRICE.normal)}</span>
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#f5b50a] bg-[#4a3d18]" />VIP {fmt(PRICE.vip)}</span>
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#ff6a72] bg-[#e50914]" />Đang chọn</span>
            <span className="flex items-center gap-2"><i className="h-4 w-5 rounded-md border border-[#2a2c33] bg-[#24262d] opacity-60" />Đã bán</span>
          </div>
        </section>
      </div>

      <div className="sticky bottom-0 z-30 border-t border-white/10 bg-[#0e1014]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1100px] flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 md:px-9">
          <div className="min-w-0 flex-1"><small className="text-xs text-white/40">Ghế đã chọn ({sel.length}/{MAX})</small><b className="mt-0.5 block truncate text-sm text-[#f5b50a]">{sel.length ? sel.join(", ") : "Chưa chọn ghế nào"}</b></div>
          <div className="text-right"><small className="text-xs text-white/40">Tạm tính</small><b className="block text-xl tabular-nums">{fmt(total)}</b></div>
          <button disabled={!sel.length} onClick={() => go("/booking/concessions")} className={btnPrimary}>Tiếp tục <Icon name="arrow" size={17} /></button>
        </div>
      </div>
    </main>
  );
}

